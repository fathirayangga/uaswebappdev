"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { KATEGORI } from "@/lib/kategori";

// ---------- Tambah buku ----------
export type FormBukuState = {
  pesan: string;
  galat?: {
    judul?: string;
    penulis?: string;
    kategori?: string;
    tahun?: string;
    stok?: string;
  };
  values?: {
    judul: string;
    penulis: string;
    kategori: string;
    tahun: string;
    stok: string;
    deskripsi: string;
  };
};

export async function tambahBuku(
  _prev: FormBukuState,
  formData: FormData
): Promise<FormBukuState> {
  // 1. Ambil data dari form
  const judul = String(formData.get("judul") ?? "").trim();
  const penulis = String(formData.get("penulis") ?? "").trim();
  const kategori = String(formData.get("kategori") ?? "").trim();
  const tahun = String(formData.get("tahun") ?? "").trim();
  const stok = String(formData.get("stok") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim();
  const values = { judul, penulis, kategori, tahun, stok, deskripsi };

  // 2. Validasi di server
  const galat: NonNullable<FormBukuState["galat"]> = {};
  if (!judul) galat.judul = "Judul wajib diisi";
  if (!penulis) galat.penulis = "Penulis wajib diisi";
  if (!KATEGORI.includes(kategori)) galat.kategori = "Pilih kategori";
  const tahunAngka = tahun ? Number(tahun) : null;
  if (tahunAngka !== null && (!Number.isInteger(tahunAngka) || tahunAngka < 1000 || tahunAngka > 2100)) {
    galat.tahun = "Tahun tidak valid";
  }
  const stokAngka = Number(stok);
  if (!stok || !Number.isInteger(stokAngka) || stokAngka < 0) {
    galat.stok = "Jumlah stok wajib diisi (angka 0 atau lebih)";
  }
  if (Object.keys(galat).length > 0) {
    return { pesan: "Periksa kembali isian Anda.", galat, values };
  }

  // 3. Simpan ke database
  let baru;
  try {
    baru = await prisma.buku.create({
      data: {
        judul,
        penulis,
        kategori,
        tahun: tahunAngka,
        stokTotal: stokAngka,
        stokTersedia: stokAngka,
        deskripsi: deskripsi || null,
      },
    });
  } catch {
    return { pesan: "Terjadi kesalahan di server.", values };
  }

  // 4. Segarkan daftar lalu pindah ke detail (di luar try/catch)
  revalidatePath("/buku");
  redirect(`/buku/${baru.id}`);
}

// ---------- Pinjam buku (transaksi) ----------
export type PinjamState = { sukses: boolean; pesan: string };

export async function pinjamBuku(
  bukuId: number,
  _prev: PinjamState,
  formData: FormData
): Promise<PinjamState> {
  const nama = String(formData.get("nama") ?? "").trim();
  if (nama.length < 2) {
    return { sukses: false, pesan: "Nama peminjam wajib diisi." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Kurangi stok hanya kalau masih ada (stokTersedia > 0)
      const hasil = await tx.buku.updateMany({
        where: { id: bukuId, stokTersedia: { gt: 0 } },
        data: { stokTersedia: { decrement: 1 } },
      });
      if (hasil.count === 0) throw new Error("STOK_HABIS");

      await tx.peminjaman.create({ data: { bukuId, namaPeminjam: nama } });
    });
  } catch (e) {
    if (e instanceof Error && e.message === "STOK_HABIS") {
      return { sukses: false, pesan: "Stok buku habis." };
    }
    return { sukses: false, pesan: "Terjadi kesalahan di server." };
  }

  revalidatePath("/buku");
  revalidatePath(`/buku/${bukuId}`);
  revalidatePath("/peminjaman");
  return { sukses: true, pesan: `Buku berhasil dipinjam oleh ${nama}.` };
}

// ---------- Kembalikan buku (transaksi) ----------
export async function kembalikanBuku(peminjamanId: number) {
  await prisma.$transaction(async (tx) => {
    const pinjam = await tx.peminjaman.findUnique({ where: { id: peminjamanId } });
    if (!pinjam || pinjam.dikembalikanPada) return; // sudah dikembalikan

    await tx.peminjaman.update({
      where: { id: peminjamanId },
      data: { dikembalikanPada: new Date() },
    });
    await tx.buku.update({
      where: { id: pinjam.bukuId },
      data: { stokTersedia: { increment: 1 } },
    });
  });

  revalidatePath("/buku");
  revalidatePath("/peminjaman");
}

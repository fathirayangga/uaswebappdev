import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { kembalikanBuku } from "@/app/actions";
import Sampul from "@/components/Sampul";

const formatTanggal = (d: Date) =>
  d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

async function DaftarPeminjaman() {
  await connection(); // selalu ambil data terbaru saat diminta

  const daftar = await prisma.peminjaman.findMany({
    include: { buku: true },
    orderBy: [{ dikembalikanPada: "asc" }, { dipinjamPada: "desc" }],
  });

  if (daftar.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-stone-700 bg-stone-900 px-6 py-12 text-center">
        <p className="font-serif text-lg font-semibold text-stone-100">Belum ada peminjaman.</p>
        <Link href="/buku" className="mt-2 inline-block text-sm font-medium text-emerald-400 hover:underline">
          Pilih buku untuk dipinjam
        </Link>
      </div>
    );
  }

  const aktif = daftar.filter((p) => !p.dikembalikanPada).length;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="rounded-xl border border-amber-800 bg-amber-950/50 p-4">
          <p className="font-serif text-2xl font-bold text-amber-300">{aktif}</p>
          <p className="text-xs text-amber-300/80">Sedang dipinjam</p>
        </div>
        <div className="rounded-xl border border-green-800 bg-green-950/50 p-4">
          <p className="font-serif text-2xl font-bold text-green-300">{daftar.length - aktif}</p>
          <p className="text-xs text-green-300/80">Sudah dikembalikan</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-stone-800 bg-stone-900 shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-stone-800 bg-stone-950/60 text-xs uppercase tracking-wide text-stone-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Peminjam</th>
              <th className="px-4 py-3 font-semibold">Buku</th>
              <th className="px-4 py-3 font-semibold">Tanggal pinjam</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {daftar.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-stone-800/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-xs font-semibold text-stone-300">
                      {p.namaPeminjam.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-medium text-stone-100">{p.namaPeminjam}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/buku/${p.bukuId}`} className="group flex items-center gap-3">
                    <Sampul judul={p.buku.judul} penulis={p.buku.penulis} kategori={p.buku.kategori} kecil />
                    <span className="text-stone-200 group-hover:text-emerald-400 group-hover:underline">{p.buku.judul}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-stone-400">{formatTanggal(p.dipinjamPada)}</td>
                <td className="px-4 py-3">
                  {p.dikembalikanPada ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-950/70 px-2.5 py-0.5 text-xs font-medium text-green-300 ring-1 ring-inset ring-green-800">
                      Dikembalikan {formatTanggal(p.dikembalikanPada)}
                    </span>
                  ) : (
                    <form action={kembalikanBuku.bind(null, p.id)} className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-950/70 px-2.5 py-0.5 text-xs font-medium text-amber-300 ring-1 ring-inset ring-amber-800">
                        Dipinjam
                      </span>
                      <button className="rounded-lg border border-emerald-500 px-3 py-1 text-xs font-medium text-emerald-400 transition hover:bg-emerald-600 hover:text-white">
                        Kembalikan
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function PeminjamanPage() {
  return (
    <main>
      <h1 className="font-serif text-3xl font-bold text-stone-100">Peminjaman</h1>
      <p className="mt-1 text-sm text-stone-400">Riwayat peminjaman dan pengembalian buku.</p>
      <Suspense
        fallback={
          <div className="mt-6 space-y-2" aria-label="Memuat data...">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-stone-800" />
            ))}
            <p className="text-sm text-stone-400">Memuat data...</p>
          </div>
        }
      >
        <DaftarPeminjaman />
      </Suspense>
    </main>
  );
}

import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StokBadge from "@/components/StokBadge";
import KategoriBadge from "@/components/KategoriBadge";
import Sampul from "@/components/Sampul";
import PinjamForm from "@/components/PinjamForm";

async function DataBuku({ params }: { params: Promise<{ id: string }> }) {
  // Parameter URL selalu string: ubah ke angka dan validasi
  const { id } = await params;
  const nomor = Number(id);
  if (!Number.isInteger(nomor)) notFound();

  const b = await prisma.buku.findUnique({
    where: { id: nomor },
    include: { peminjaman: { where: { dikembalikanPada: null }, orderBy: { dipinjamPada: "desc" } } },
  });
  if (!b) notFound();

  const persen = b.stokTotal > 0 ? Math.round((b.stokTersedia / b.stokTotal) * 100) : 0;

  return (
    <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
      <div className="mx-auto w-48 md:w-full">
        <Sampul judul={b.judul} penulis={b.penulis} kategori={b.kategori} />
      </div>

      <div className="space-y-6">
        <div>
          <KategoriBadge kategori={b.kategori} />
          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-stone-100 sm:text-4xl">{b.judul}</h1>
          <p className="mt-1 text-stone-400">oleh {b.penulis}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
            <dt className="text-xs text-stone-400">Penulis</dt>
            <dd className="mt-1 font-medium text-stone-100">{b.penulis}</dd>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
            <dt className="text-xs text-stone-400">Tahun terbit</dt>
            <dd className="mt-1 font-medium text-stone-100">{b.tahun ?? "-"}</dd>
          </div>
          <div className="col-span-2 rounded-xl border border-stone-800 bg-stone-900 p-4 sm:col-span-1">
            <dt className="text-xs text-stone-400">Stok</dt>
            <dd className="mt-1">
              <StokBadge tersedia={b.stokTersedia} total={b.stokTotal} panjang />
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-800">
                <div
                  className={`h-full rounded-full ${b.stokTersedia === 0 ? "bg-red-500" : "bg-green-500"}`}
                  style={{ width: `${persen}%` }}
                />
              </div>
            </dd>
          </div>
        </dl>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400">Deskripsi</h2>
          <p className="mt-2 leading-relaxed text-stone-300">{b.deskripsi ?? "Belum ada deskripsi."}</p>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-900 p-5 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-stone-100">Pinjam buku ini</h2>
          <PinjamForm bukuId={b.id} habis={b.stokTersedia === 0} />

          {b.peminjaman.length > 0 && (
            <div className="mt-5 border-t border-stone-800 pt-4">
              <p className="text-xs text-stone-400">Sedang dipinjam oleh</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {b.peminjaman.map((p) => (
                  <span key={p.id} className="rounded-full bg-amber-950/70 px-2.5 py-0.5 text-xs font-medium text-amber-300 ring-1 ring-inset ring-amber-800">
                    {p.namaPeminjam}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MemuatDetail() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]" aria-label="Memuat data...">
      <div className="mx-auto aspect-[2/3] w-48 animate-pulse rounded-lg bg-stone-800 md:w-full" />
      <div className="space-y-4">
        <div className="h-9 w-2/3 animate-pulse rounded-lg bg-stone-800" />
        <div className="h-24 animate-pulse rounded-xl bg-stone-800" />
        <p className="text-sm text-stone-400">Memuat data...</p>
      </div>
    </div>
  );
}

export default function DetailBukuPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main>
      <Link href="/buku" className="text-sm font-medium text-stone-400 transition hover:text-emerald-400">
        &larr; Kembali ke daftar
      </Link>
      <Suspense fallback={<MemuatDetail />}>
        <DataBuku params={params} />
      </Suspense>
    </main>
  );
}

import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

const fitur = [
  {
    judul: "Daftar buku",
    isi: "Lihat semua koleksi perpustakaan beserta stok yang tersedia.",
    ikon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z",
  },
  {
    judul: "Cari cepat",
    isi: "Cari buku berdasarkan judul, penulis, atau kategori.",
    ikon: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35",
  },
  {
    judul: "Tambah buku",
    isi: "Petugas dapat menambahkan buku baru ke database.",
    ikon: "M12 5v14M5 12h14",
  },
  {
    judul: "Peminjaman",
    isi: "Catat peminjaman dan pengembalian, stok berubah otomatis.",
    ikon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  },
];

// Punggung buku dekoratif di hero
const rak = [
  { tinggi: "h-40", warna: "bg-rose-400" },
  { tinggi: "h-48", warna: "bg-amber-300" },
  { tinggi: "h-36", warna: "bg-sky-400" },
  { tinggi: "h-44", warna: "bg-emerald-300" },
  { tinggi: "h-52", warna: "bg-violet-400" },
  { tinggi: "h-40", warna: "bg-orange-300" },
];

async function Statistik() {
  await connection(); // angka selalu terbaru

  const [judul, jumlah, aktif] = await Promise.all([
    prisma.buku.count(),
    prisma.buku.aggregate({ _sum: { stokTotal: true, stokTersedia: true } }),
    prisma.peminjaman.count({ where: { dikembalikanPada: null } }),
  ]);

  const data = [
    { angka: judul, label: "Judul buku" },
    { angka: jumlah._sum.stokTotal ?? 0, label: "Total eksemplar" },
    { angka: jumlah._sum.stokTersedia ?? 0, label: "Siap dipinjam" },
    { angka: aktif, label: "Sedang dipinjam" },
  ];

  return (
    <>
      {data.map((d) => (
        <div key={d.label} className="rounded-xl border border-stone-800 bg-stone-900 p-5 text-center shadow-sm">
          <p className="font-serif text-3xl font-bold text-emerald-400">{d.angka}</p>
          <p className="mt-1 text-sm text-stone-400">{d.label}</p>
        </div>
      ))}
    </>
  );
}

function StatistikKosong() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-[98px] animate-pulse rounded-xl border border-stone-800 bg-stone-900" />
      ))}
    </>
  );
}

export default function Home() {
  return (
    <main className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-800 to-emerald-950 px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16">
        <div className="relative z-10 max-w-xl space-y-5">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-100 ring-1 ring-white/20">
            Perpustakaan SMA
          </span>
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Pinjam buku jadi lebih mudah.
          </h1>
          <p className="text-emerald-100/90">
            PustakaKu adalah aplikasi web sederhana untuk menggantikan pencatatan
            peminjaman buku perpustakaan SMA yang masih manual. Semua data buku dan
            peminjaman tersimpan di database SQLite.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/buku"
              className="rounded-lg bg-amber-400 px-6 py-3 font-semibold text-stone-900 shadow-sm transition hover:bg-amber-300"
            >
              Lihat Daftar Buku
            </Link>
            <Link
              href="/peminjaman"
              className="rounded-lg px-6 py-3 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
            >
              Peminjaman
            </Link>
          </div>
        </div>

        <div className="absolute right-10 bottom-0 hidden items-end gap-1.5 md:flex" aria-hidden>
          {rak.map((b, i) => (
            <div key={i} className={`${b.tinggi} ${b.warna} w-9 rounded-t-sm opacity-90 shadow-lg`}>
              <div className="mx-auto mt-4 h-0.5 w-5 bg-black/20" />
              <div className="mx-auto mt-1 h-0.5 w-5 bg-black/20" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Suspense fallback={<StatistikKosong />}>
          <Statistik />
        </Suspense>
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-2xl font-bold">Apa yang bisa dilakukan?</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fitur.map((f) => (
            <div
              key={f.judul}
              className="flex gap-4 rounded-xl border border-stone-800 bg-stone-900 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-700 hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-950/80 text-emerald-400 ring-1 ring-inset ring-emerald-800">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d={f.ikon} />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-stone-100">{f.judul}</h3>
                <p className="mt-1 text-sm text-stone-400">{f.isi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

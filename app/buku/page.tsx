import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { KATEGORI } from "@/lib/kategori";
import StokBadge from "@/components/StokBadge";
import KategoriBadge from "@/components/KategoriBadge";
import Sampul from "@/components/Sampul";

type Cari = { q?: string | string[]; kategori?: string | string[] };

function ambil(nilai?: string | string[]) {
  return (Array.isArray(nilai) ? nilai[0] : nilai)?.trim() || undefined;
}

// Buat link filter kategori yang tetap menyimpan kata kunci pencarian
function linkKategori(q?: string, kategori?: string) {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (kategori) sp.set("kategori", kategori);
  const s = sp.toString();
  return s ? `/buku?${s}` : "/buku";
}

function MemuatTabel() {
  return (
    <div className="mt-6 space-y-2" aria-label="Memuat data...">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-stone-800" />
      ))}
      <p className="text-sm text-stone-400">Memuat data...</p>
    </div>
  );
}

async function TabelBuku({ q, kategori }: { q?: string; kategori?: string }) {
  const daftar = await prisma.buku.findMany({
    where: {
      AND: [
        q ? { OR: [{ judul: { contains: q } }, { penulis: { contains: q } }] } : {},
        kategori ? { kategori } : {},
      ],
    },
    orderBy: { judul: "asc" },
  });

  if (daftar.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-stone-700 bg-stone-900 px-6 py-12 text-center">
        <p className="font-serif text-lg font-semibold text-stone-100">Buku tidak ditemukan.</p>
        <p className="mt-1 text-sm text-stone-400">Coba kata kunci atau kategori lain.</p>
        <Link href="/buku" className="mt-4 inline-block text-sm font-medium text-emerald-400 hover:underline">
          Tampilkan semua buku
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-6 text-sm text-stone-400">Menampilkan {daftar.length} buku</p>
      <div className="mt-2 overflow-x-auto rounded-xl border border-stone-800 bg-stone-900 shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-stone-800 bg-stone-950/60 text-xs uppercase tracking-wide text-stone-400">
            <tr>
              <th className="px-4 py-3 font-semibold">No</th>
              <th className="px-4 py-3 font-semibold">Judul</th>
              <th className="px-4 py-3 font-semibold">Kategori</th>
              <th className="px-4 py-3 font-semibold">Stok</th>
              <th className="px-4 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {daftar.map((b, i) => (
              <tr key={b.id} className="transition-colors hover:bg-stone-800/50">
                <td className="px-4 py-3 text-stone-500">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Sampul judul={b.judul} penulis={b.penulis} kategori={b.kategori} kecil />
                    <div>
                      <p className="font-semibold text-stone-100">{b.judul}</p>
                      <p className="text-xs text-stone-400">{b.penulis}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <KategoriBadge kategori={b.kategori} />
                </td>
                <td className="px-4 py-3">
                  <StokBadge tersedia={b.stokTersedia} total={b.stokTotal} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/buku/${b.id}`}
                    className="rounded-lg border border-stone-700 px-3 py-1.5 text-xs font-medium text-stone-200 transition hover:border-emerald-500 hover:text-emerald-400"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

async function PencarianBuku({ searchParams }: { searchParams: Promise<Cari> }) {
  const sp = await searchParams;
  const q = ambil(sp.q);
  const kategori = ambil(sp.kategori);

  return (
    <>
      <form
        action="/buku"
        method="get"
        className="mt-6 flex flex-col gap-2 rounded-xl border border-stone-800 bg-stone-900 p-3 shadow-sm sm:flex-row"
      >
        <div className="relative w-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-500">
            <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35" />
          </svg>
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari judul atau penulis"
            className="w-full rounded-lg border border-stone-700 bg-stone-950 py-2 pr-3 pl-9 text-stone-100 placeholder:text-stone-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <select
          name="kategori"
          defaultValue={kategori ?? ""}
          className="rounded-lg border border-stone-700 bg-stone-950 p-2 text-stone-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Semua kategori</option>
          {KATEGORI.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <button className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white transition hover:bg-emerald-500">
          Cari
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {[undefined, ...KATEGORI].map((k) => (
          <Link
            key={k ?? "semua"}
            href={linkKategori(q, k)}
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition ${
              kategori === k
                ? "bg-stone-100 text-stone-900 ring-stone-100"
                : "bg-stone-900 text-stone-300 ring-stone-700 hover:ring-stone-500"
            }`}
          >
            {k ?? "Semua"}
          </Link>
        ))}
      </div>

      <Suspense key={`${q}-${kategori}`} fallback={<MemuatTabel />}>
        <TabelBuku q={q} kategori={kategori} />
      </Suspense>
    </>
  );
}

export default function DaftarBukuPage({ searchParams }: { searchParams: Promise<Cari> }) {
  return (
    <main>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-100">Daftar buku</h1>
          <p className="mt-1 text-sm text-stone-400">Semua koleksi perpustakaan dan stoknya.</p>
        </div>
        <Link
          href="/buku/baru"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500"
        >
          + Tambah buku
        </Link>
      </div>
      <Suspense fallback={<MemuatTabel />}>
        <PencarianBuku searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

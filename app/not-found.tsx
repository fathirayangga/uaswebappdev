import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md space-y-4 py-12 text-center">
      <p className="font-serif text-7xl font-bold text-emerald-400">404</p>
      <h1 className="font-serif text-2xl font-bold text-stone-100">Halaman tidak ditemukan</h1>
      <p className="text-stone-400">
        Buku atau halaman yang Anda cari tidak ada. Mungkin sudah dipindahkan ke rak lain.
      </p>
      <Link
        href="/buku"
        className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-500"
      >
        Kembali ke daftar buku
      </Link>
    </main>
  );
}

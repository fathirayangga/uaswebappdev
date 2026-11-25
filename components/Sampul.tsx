import { warnaKategori } from "@/lib/kategori";

// Sampul buku buatan (gradasi warna sesuai kategori)
export default function Sampul({
  judul,
  penulis,
  kategori,
  kecil = false,
}: {
  judul: string;
  penulis: string;
  kategori: string;
  kecil?: boolean;
}) {
  const warna = warnaKategori(kategori).sampul;

  if (kecil) {
    return (
      <div
        className={`relative flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-linear-to-br ${warna} font-serif text-sm font-bold text-white shadow-sm`}
      >
        <span className="absolute inset-y-0 left-0 w-1 bg-black/20" />
        {judul.charAt(0)}
      </div>
    );
  }

  return (
    <div
      className={`relative flex aspect-[2/3] w-full flex-col justify-between overflow-hidden rounded-lg bg-linear-to-br ${warna} p-5 pl-7 text-white shadow-xl`}
    >
      <span className="absolute inset-y-0 left-0 w-3 bg-black/20" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
        {kategori}
      </span>
      <div>
        <p className="font-serif text-xl font-bold leading-tight">{judul}</p>
        <p className="mt-2 text-xs text-white/80">{penulis}</p>
      </div>
    </div>
  );
}

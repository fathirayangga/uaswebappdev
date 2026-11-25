import { warnaKategori } from "@/lib/kategori";

export default function KategoriBadge({ kategori }: { kategori: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${warnaKategori(kategori).label}`}
    >
      {kategori}
    </span>
  );
}

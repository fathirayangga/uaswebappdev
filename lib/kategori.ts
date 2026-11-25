export const KATEGORI = ["Novel", "Sains", "Sejarah", "Pelajaran", "Komik"];

// Warna sampul dan label untuk tiap kategori
const WARNA: Record<string, { sampul: string; label: string }> = {
  Novel: { sampul: "from-rose-500 to-rose-800", label: "bg-rose-950/70 text-rose-300 ring-rose-800" },
  Sains: { sampul: "from-sky-500 to-sky-800", label: "bg-sky-950/70 text-sky-300 ring-sky-800" },
  Sejarah: { sampul: "from-amber-500 to-amber-800", label: "bg-amber-950/70 text-amber-300 ring-amber-800" },
  Pelajaran: { sampul: "from-emerald-500 to-emerald-800", label: "bg-emerald-950/70 text-emerald-300 ring-emerald-800" },
  Komik: { sampul: "from-violet-500 to-violet-800", label: "bg-violet-950/70 text-violet-300 ring-violet-800" },
};

export function warnaKategori(kategori: string) {
  return WARNA[kategori] ?? { sampul: "from-stone-500 to-stone-800", label: "bg-stone-800 text-stone-300 ring-stone-700" };
}

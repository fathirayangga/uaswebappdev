export default function StokBadge({
  tersedia,
  total,
  panjang = false,
}: {
  tersedia: number;
  total: number;
  panjang?: boolean;
}) {
  const habis = tersedia === 0;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        habis ? "bg-red-950/70 text-red-300 ring-red-800" : "bg-green-950/70 text-green-300 ring-green-800"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${habis ? "bg-red-400" : "bg-green-400"}`} />
      {panjang ? `${tersedia} dari ${total} tersedia` : `${tersedia}/${total}`}
    </span>
  );
}

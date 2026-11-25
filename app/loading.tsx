export default function Loading() {
  return (
    <div className="space-y-4" aria-label="Memuat halaman...">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-stone-800" />
      <div className="h-4 w-72 animate-pulse rounded bg-stone-800" />
      <div className="h-64 animate-pulse rounded-xl bg-stone-800" />
      <p className="text-sm text-stone-400">Memuat halaman...</p>
    </div>
  );
}

import Link from "next/link";
import FormBuku from "@/components/FormBuku";

export default function TambahBukuPage() {
  return (
    <main className="mx-auto max-w-xl">
      <Link href="/buku" className="text-sm font-medium text-stone-400 transition hover:text-emerald-400">
        &larr; Kembali ke daftar
      </Link>
      <div className="mt-4">
        <FormBuku />
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { tambahBuku, type FormBukuState } from "@/app/actions";
import { KATEGORI } from "@/lib/kategori";

const awal: FormBukuState = { pesan: "" };

// Border merah kalau ada galat di field itu
function kelasInput(galat?: string) {
  return `mt-1 w-full rounded-lg border bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-500 outline-none transition focus:ring-2 ${
    galat
      ? "border-red-500 focus:border-red-400 focus:ring-red-500/20"
      : "border-stone-700 focus:border-emerald-500 focus:ring-emerald-500/20"
  }`;
}

function Galat({ pesan }: { pesan?: string }) {
  return pesan ? <p className="mt-1 text-sm text-red-400">{pesan}</p> : null;
}

export default function FormBuku() {
  const [state, formAction, pending] = useActionState(tambahBuku, awal);
  const g = state.galat;

  return (
    <form action={formAction} className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-sm">
      <div className="border-b border-stone-800 bg-stone-950/60 px-6 py-5">
        <h1 className="font-serif text-2xl font-bold text-stone-100">Tambah buku baru</h1>
        <p className="mt-1 text-sm text-stone-400">Kolom bertanda * wajib diisi.</p>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <label htmlFor="judul" className="block text-sm font-medium">Judul *</label>
          <input id="judul" name="judul" placeholder="Judul buku"
            defaultValue={state.values?.judul} className={kelasInput(g?.judul)} />
          <Galat pesan={g?.judul} />
        </div>

        <div>
          <label htmlFor="penulis" className="block text-sm font-medium">Penulis *</label>
          <input id="penulis" name="penulis" placeholder="Nama penulis"
            defaultValue={state.values?.penulis} className={kelasInput(g?.penulis)} />
          <Galat pesan={g?.penulis} />
        </div>

        <div>
          <label htmlFor="kategori" className="block text-sm font-medium">Kategori *</label>
          <select id="kategori" name="kategori" key={state.values?.kategori}
            defaultValue={state.values?.kategori ?? ""} className={kelasInput(g?.kategori)}>
            <option value="">Pilih kategori</option>
            {KATEGORI.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <Galat pesan={g?.kategori} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tahun" className="block text-sm font-medium">Tahun terbit</label>
            <input id="tahun" name="tahun" type="number" placeholder="2005"
              defaultValue={state.values?.tahun} className={kelasInput(g?.tahun)} />
            <Galat pesan={g?.tahun} />
          </div>
          <div>
            <label htmlFor="stok" className="block text-sm font-medium">Jumlah stok *</label>
            <input id="stok" name="stok" type="number" min={0} placeholder="5"
              defaultValue={state.values?.stok} className={kelasInput(g?.stok)} />
            <Galat pesan={g?.stok} />
          </div>
        </div>

        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium">Deskripsi</label>
          <textarea id="deskripsi" name="deskripsi" rows={4} placeholder="Deskripsi buku"
            defaultValue={state.values?.deskripsi} className={kelasInput()} />
        </div>

        {state.pesan && (
          <p className="rounded-lg bg-red-950/70 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-800">{state.pesan}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-stone-800 bg-stone-950/60 px-6 py-4">
        <Link href="/buku"
          className="rounded-lg border border-stone-700 bg-stone-900 px-4 py-2 text-sm font-medium text-stone-200 transition hover:bg-stone-800">
          Batal
        </Link>
        <button type="submit" disabled={pending}
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50">
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}

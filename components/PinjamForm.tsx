"use client";

import { useActionState } from "react";
import { pinjamBuku, type PinjamState } from "@/app/actions";

const awal: PinjamState = { sukses: false, pesan: "" };

export default function PinjamForm({ bukuId, habis }: { bukuId: number; habis: boolean }) {
  const [state, formAction, pending] = useActionState(pinjamBuku.bind(null, bukuId), awal);

  return (
    <form action={formAction} className="mt-3 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="nama"
          placeholder="Nama peminjam"
          disabled={habis}
          className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-stone-100 placeholder:text-stone-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-stone-800 disabled:text-stone-500"
        />
        <button
          disabled={habis || pending}
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400"
        >
          {pending ? "Memproses..." : "Pinjam"}
        </button>
      </div>
      {habis && (
        <p className="rounded-lg bg-red-950/70 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-800">
          Stok kosong, buku tidak bisa dipinjam.
        </p>
      )}
      {state.pesan && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ring-1 ring-inset ${
            state.sukses
              ? "bg-green-950/70 text-green-300 ring-green-800"
              : "bg-red-950/70 text-red-300 ring-red-800"
          }`}
        >
          {state.pesan}
        </p>
      )}
    </form>
  );
}

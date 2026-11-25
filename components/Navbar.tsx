import { Suspense } from "react";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import { MENU, kelasMenu } from "@/lib/menu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-1 gap-y-2 px-4 py-3">
        <Link href="/" className="mr-auto flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z" />
              <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
            </svg>
          </span>
          <span className="font-serif text-xl font-bold text-stone-100">PustakaKu</span>
        </Link>
        <Suspense
          fallback={MENU.map((m) => (
            <Link key={m.href} href={m.href} className={`${kelasMenu} text-stone-300`}>
              {m.label}
            </Link>
          ))}
        >
          <NavLinks />
        </Suspense>
      </nav>
    </header>
  );
}

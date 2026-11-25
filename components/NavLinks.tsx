"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU, kelasMenu } from "@/lib/menu";

function aktif(path: string, href: string) {
  if (href === "/") return path === "/";
  if (href === "/buku") return path === "/buku" || (path.startsWith("/buku/") && path !== "/buku/baru");
  return path === href;
}

export default function NavLinks() {
  const path = usePathname();

  return (
    <>
      {MENU.map((m) => (
        <Link
          key={m.href}
          href={m.href}
          className={`${kelasMenu} ${
            aktif(path, m.href)
              ? "bg-emerald-600 text-white"
              : "text-stone-300 hover:bg-stone-800 hover:text-stone-100"
          }`}
        >
          {m.label}
        </Link>
      ))}
    </>
  );
}

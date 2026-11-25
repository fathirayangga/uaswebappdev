import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PustakaKu",
  description: "Aplikasi peminjaman buku perpustakaan sekolah",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Navbar />
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-10">{children}</div>
        <footer className="border-t border-stone-800 bg-stone-950">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-1 px-4 py-5 text-xs text-stone-400 sm:flex-row">
            <span className="font-serif font-semibold text-stone-200">PustakaKu</span>
            <span>Perpustakaan sekolah digital &copy; 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

# PustakaKu

Aplikasi web peminjaman buku perpustakaan SMA. Dibuat untuk UAS Web Application Development.

## Teknologi

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM + SQLite (file `prisma/dev.db`)
- Server Actions untuk tambah buku, pinjam, dan kembalikan

## Cara menjalankan

Butuh Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

`npm install` otomatis menjalankan `prisma generate`. `npm run dev` otomatis menjalankan migrasi (`prisma migrate deploy`) dan seed (`prisma db seed`), jadi database dan data contoh langsung terbentuk. Seed hanya mengisi data kalau tabel masih kosong.

Untuk mengosongkan dan mengisi ulang database: `npm run db:reset`.

## Halaman

| No | Halaman | Rute | Isi |
| --- | --- | --- | --- |
| 1 | Landing page | `/` | Penjelasan aplikasi dan tombol ke Daftar Buku |
| 2 | Daftar Buku | `/buku` | Tabel buku, cari judul/penulis, filter kategori, tombol Tambah buku, stok merah bila kosong |
| 3 | Detail Buku | `/buku/[id]` | Detail buku, stok, form pinjam |
| 4 | Form Tambah | `/buku/baru` | Form tambah buku dengan validasi |
| 5 | Peminjaman | `/peminjaman` | Riwayat peminjaman dan tombol Kembalikan |

Semua halaman memakai navbar bersama di `app/layout.tsx`. Ada `app/loading.tsx` dan `app/not-found.tsx` (404 untuk ID yang tidak ada atau bukan angka).

## Struktur folder

```text
app/
  layout.tsx          navbar bersama
  page.tsx            landing page
  loading.tsx         tampilan loading
  not-found.tsx       halaman 404
  actions.ts          Server Actions (tambahBuku, pinjamBuku, kembalikanBuku)
  buku/page.tsx       daftar + pencarian
  buku/[id]/page.tsx  detail buku
  buku/baru/page.tsx  form tambah
  peminjaman/page.tsx riwayat peminjaman
components/           Navbar, StokBadge, FormBuku, PinjamForm
lib/prisma.ts         koneksi Prisma tunggal
lib/kategori.ts       daftar kategori
prisma/schema.prisma  skema tabel Buku dan Peminjaman
prisma/seed.mjs       data contoh
```

## Database

- `Buku`: id, judul, penulis, kategori, tahun, stokTotal, stokTersedia, deskripsi, createdAt
- `Peminjaman`: id, bukuId, namaPeminjam, dipinjamPada, dikembalikanPada

Pinjam dan kembalikan memakai `prisma.$transaction`, jadi stok dan data peminjaman selalu konsisten. Stok hanya dikurangi kalau masih lebih dari 0. Semua query lewat Prisma (parameter terikat).

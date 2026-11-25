-- CreateTable
CREATE TABLE "Buku" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judul" TEXT NOT NULL,
    "penulis" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "tahun" INTEGER,
    "stokTotal" INTEGER NOT NULL,
    "stokTersedia" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Peminjaman" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bukuId" INTEGER NOT NULL,
    "namaPeminjam" TEXT NOT NULL,
    "dipinjamPada" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dikembalikanPada" DATETIME,
    CONSTRAINT "Peminjaman_bukuId_fkey" FOREIGN KEY ("bukuId") REFERENCES "Buku" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

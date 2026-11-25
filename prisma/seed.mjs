import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// stokTotal = jumlah eksemplar, dipinjam = nama peminjam yang belum mengembalikan
const dataBuku = [
  { judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: "Novel", tahun: 2005, stokTotal: 5, deskripsi: "Kisah sepuluh anak Belitung yang berjuang untuk sekolah.", dipinjam: ["Budi", "Sari"] },
  { judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", kategori: "Novel", tahun: 1980, stokTotal: 2, deskripsi: "Roman sejarah tentang Minke di masa kolonial.", dipinjam: ["Rina", "Dewi"] },
  { judul: "Fisika Dasar", penulis: "Halliday", kategori: "Sains", tahun: 2010, stokTotal: 2, deskripsi: "Buku pengantar fisika untuk SMA dan kuliah.", dipinjam: [] },
  { judul: "Sejarah Indonesia Modern", penulis: "M.C. Ricklefs", kategori: "Sejarah", tahun: 2008, stokTotal: 3, deskripsi: "Sejarah Indonesia dari tahun 1200 hingga kini.", dipinjam: ["Andi"] },
  { judul: "Matematika Kelas XI", penulis: "Tim Kemendikbud", kategori: "Pelajaran", tahun: 2017, stokTotal: 10, deskripsi: "Buku paket matematika kurikulum 2013.", dipinjam: ["Tono", "Lia", "Joko"] },
  { judul: "Si Juki: Lika-liku Anak Kos", penulis: "Faza Meonk", kategori: "Komik", tahun: 2014, stokTotal: 1, deskripsi: "Komik humor kehidupan mahasiswa.", dipinjam: ["Eka"] },
  { judul: "Biologi Sel", penulis: "Campbell", kategori: "Sains", tahun: null, stokTotal: 4, deskripsi: null, dipinjam: [] },
  { judul: "Ronggeng Dukuh Paruk", penulis: "Ahmad Tohari", kategori: "Novel", tahun: 1982, stokTotal: 3, deskripsi: "Kisah Srintil, ronggeng dari Dukuh Paruk.", dipinjam: ["Maya"] },
];

async function main() {
  const jumlah = await prisma.buku.count();
  if (jumlah > 0) {
    console.log(`Seed dilewati: sudah ada ${jumlah} buku.`);
    return;
  }

  for (const { dipinjam, ...buku } of dataBuku) {
    await prisma.buku.create({
      data: {
        ...buku,
        stokTersedia: buku.stokTotal - dipinjam.length,
        peminjaman: { create: dipinjam.map((nama) => ({ namaPeminjam: nama })) },
      },
    });
  }
  console.log(`Seed selesai: ${dataBuku.length} buku dibuat.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

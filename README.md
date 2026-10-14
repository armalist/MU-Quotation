# Generator PH Mata Utama — Panduan Lengkap

Untuk: Account / main person Tower Media Group & klien lain, PT Mata Utama Indonesia
Versi 2: Oktober 2026, dengan 7 format PH

Isi panduan:
- A. Isi paket
- B. 7 format PH
- C. Fungsi HTML satu per satu
- D. Cara kerja harga modal, margin, dan pajak
- E. Update database
- F. Cara bikin HTML-nya
- G. Catatan

---

## A. Isi paket ZIP

| File / folder | Isi |
|---|---|
| `Generator_PH_Mata_Utama.html` | **Aplikasinya.** Satu file, buka dengan klik dua kali, bisa offline. |
| `database/Ratecard_Database_MU.xlsx` dan `.csv` | Database rate card: 4.059 item dari 761 PH terverifikasi 2025–2026 |
| `database/Template_Upload_Ratecard.xlsx` | Template kosong untuk database baru (mis. price list purchasing) |
| `excel/PH-MU_Quotation_Simpel.xlsx` | Versi Excel (format surat resmi saja), untuk cadangan |
| `source/` | Kode sumber + script perakit |
| `CARA_BIKIN_HTML.md` | Panduan ini |

---

## B. 7 format PH

Format dipilih di **2 · Format & Data PH → Format / template PH**. Semua format memakai data item yang sama, jadi ganti format tidak menghapus isian. Klik **Muat contoh format ini** untuk melihat contoh isinya.

Format disusun dari pola kolom 1.197 file quotation 2025–2026 yang dikirim.

| # | Format | Kolom utama | Dipakai untuk (dari data) |
|---|---|---|---|
| 1 | **Surat Resmi Mata Utama** | No · Lokasi · Item · Description · Qty · Unit · Total Cost · Total | Tabel sederhana: Tower Media, Global Teknologi, Mitracomm, Djojonegoro, klien umum (±380 PH) |
| 2 | **Surat + Desain & Dimensi** | No · Lokasi · Description · **Design (gambar)** · Ukuran · **Luas m²** · Qty · Unit · Unit Price · Total | Sticker chiller, wall branding, signage: Otri, Ultima, Akasha, BTN, Tangkas (±246 PH dengan kolom gambar/dimensi) |
| 3 | **Ringkas + Foto Item** | NO · SITE NAME · **ITEMS (foto)** · NAME ITEMS · SIZE · QTY · SPEC · PRICE · TOTAL | Display base, acrylic stand, price tag: Sony, Xiaomi, Jakarana (±108 PH). Ada kolom *Client Approval*. |
| 4 | **Rollout Multi-Store (Cheil)** | Halaman **SUMMARY per toko** + detail: Channel code · Site · City · Province · Action/Material · **Visual** · Dimension · m² · Qty · Unit · Unit price · **Transport** · Total | Maintenance & rollout banyak toko: Cheil/Samsung SES & MBS, Intan Media (±254 PH). Tanda tangan 3 kotak *Approved by* (MU, client, principal). |
| 5 | **Format Indicia** | ITEM VISIBILITY · BRAND/KV · Nama Toko · P · L · Material · Qty · Satuan · Price/unit · Total | Permintaan ADM Indicia: judul kuning, kotak STORE NAME / TOTAL VALUE / NO QUOTATION, header hitam, "Total Project" (±123 PH). Bisa pakai logo klien. |
| 6 | **BQ / RAB Store Build** | NO (I, II, III…) · KODE · URAIAN PEKERJAAN · VOL · SAT · HARGA SATUAN · JUMLAH · **%** | Renovasi / store build: Global Teknologi (Blibli), Erafone, Global Digital Niaga (±39 PH). Item dikelompokkan per bagian pekerjaan dengan subtotal dan persentase. |
| 7 | **Jasa / Manpower Harian** | TANGGAL · BRAND · KERJAAN · PERSON · ACTION · QTY · TIME/JAM · COST · TOTAL | Install / takeout hoarding, frame: Sinar Cahaya Merdeka, Bapak Wilton (±46 PH) |

**Isian item menyesuaikan format.** Kotak yang tidak dipakai format terpilih disembunyikan:
- Rollout menampilkan Channel code, Kota, Provinsi, Action, Transport, dan gambar.
- BQ memakai kotak "Bagian pekerjaan" untuk mengelompokkan item (I. Persiapan, II. Sipil, …).
- Manpower menampilkan Tanggal kerja, Person, dan Jam.

**Gambar bahan / desain** (format 2, 3, 4): klik **+ Gambar / foto bahan** di bawah tiap item.
- Gambar otomatis diperkecil supaya file PDF/Excel tetap ringan.
- Gambar ikut tercetak di PDF dan tertempel di Excel.

**Logo**:
- *Mata Utama* (bawaan), *Logo klien* (upload sekali, misalnya untuk form Indicia), atau *Tanpa logo*.
- Tanda tangan Mata Utama selalu "Hormat Kami, PT. MATA UTAMA INDONESIA".

---

## C. Fungsi HTML satu per satu

### Kepala halaman
- **Judul + keterangan**: jumlah item rate card yang aktif. Draf dan database tersimpan otomatis di browser ini.

### Panel 1 · Database Rate Card

| Tombol / kotak | Fungsinya |
|---|---|
| Info database | Jumlah item, kategori, sub kategori, berapa item punya Modal/HPP, sumber data, dan tanggal upload |
| **Upload database…** | Membaca file Excel/CSV rate card baru dan menjadikannya acuan harga |
| Tarik file ke kotak putus-putus | Sama dengan Upload, cukup drag & drop |
| **Update (timpa + tambah)** | Mode upload. Item dengan kunci sama ditimpa, item baru ditambah, sisanya tetap. |
| **Ganti semua** | Mode upload. Seluruh database diganti isi file. |
| **Unduh database** | Mengunduh database aktif sebagai Excel untuk diedit lalu di-upload lagi |
| **Unduh template** | Mengunduh template kosong dengan 3 baris contoh |
| **Kembali ke bawaan** | Membatalkan semua upload dan kembali ke rate card historis |

### Panel 2 · Format & Data PH

| Isian | Fungsinya |
|---|---|
| **Format / template PH** | Memilih 1 dari 7 format (lihat bagian B). Keterangan di bawahnya menjelaskan format itu biasa dipakai untuk klien apa. |
| **Muat contoh format ini** | Mengisi form dengan contoh lengkap format terpilih. Draf sekarang tertimpa, jadi simpan draf dulu. |
| **Logo di kepala PH** + Upload logo klien | Pilihan logo (lihat bagian B) |
| Tanggal PH, No PH | **Boleh kosong.** Nomor dari Finance, tidak dibuat otomatis. Di PDF tertulis "(diisi Finance)"; di Excel selnya kuning dan ada catatan. |
| Kepada Yth, Alamat 1–2, UP | Data penerima. Ketik nama client → muncul tombol "Saran:" untuk UP, Lokasi, dan PIC Sales dari riwayat PH. |
| PIC Sales | Untuk baris rekap PH-MU2026 (tidak tercetak) |
| Perihal | Kosong = otomatis "Penawaran Harga + Nama Proyek" |
| Nama Proyek, Periode, Lokasi, Detail Pekerjaan | Tercetak di kepala PH. Di format Indicia, "Lokasi" menjadi STORE NAME. |
| Principal / PIC principal | Hanya format Rollout: kotak *Approved by* ke-3 (mis. PT Samsung Electronics Indonesia) |
| Kategori Proyek | Untuk rekap (tidak tercetak) |
| **Pajak** | PPN 11% atau NON PPN |
| **Margin default (%)** | 0–200%. Dipakai semua item yang Modal/HPP-nya diisi, kecuali item itu punya margin sendiri. |
| Diskon (Rp) | Potongan harga sebelum PPN |
| Kalimat pembuka | "…untuk pekerjaan sebagai berikut" atau "…pekerjaan lanjutan sebagai berikut" (format surat) |
| Catatan | Tercetak di bawah tabel, mis. masa berlaku harga atau termin |

### Panel 3 · Daftar Item (per item)

| Isian | Fungsinya |
|---|---|
| Lokasi / Site / Nama store / Bagian pekerjaan | Label berubah sesuai format. Di Rollout dan BQ dipakai untuk **mengelompokkan** item. |
| **Cari rate card** | Ketik sebagian nama (mis. "neon box") → pilih → Kategori, Sub, Item, Ukuran, Unit, dan Modal DB terisi otomatis |
| **Kategori → Sub Kategori → Item rate card** | Cara kedua memilih item dari database. Angka dalam kurung = jumlah item di sub itu. |
| Channel code, Kota, Provinsi, Brand/KV, Action, Tanggal kerja, Person, Jam | Kolom khusus format tertentu (lihat bagian B) |
| P / L / T (cm) | Dimensi. Kalau Unit = **m2**, harga dihitung **per m²** (lihat bagian D). |
| Transport (Rp) | Biaya kirim per baris. Di format Rollout jadi kolom sendiri; di format lain tercetak sebagai baris "Transport" terpisah. |
| Item (tercetak di PH) | Nama yang tercetak. Boleh diubah tanpa memutus hubungan ke rate card. |
| Description / Material | Spesifikasi bahan. Bisa beberapa baris (Enter). |
| Ukuran | Teks bebas (mis. "120 x 40 x 200 cm"). Kosong = otomatis dari P × L × T. |
| Qty, Unit | Jumlah dan satuan |
| **Modal / HPP** | Harga pokok per unit (dari purchasing/vendor). Kalau diisi → harga = modal × (1 + margin). |
| **Margin %** | Margin khusus item ini. Kosong = ikut margin default. |
| **Harga manual** | Menimpa semua perhitungan. Dipakai kalau harga sudah disepakati / negosiasi. |
| Harga satuan, Total | Hasil perhitungan (lihat bagian D). Harga dari modal **tidak dibulatkan** ke ribuan, hanya ke rupiah terdekat. |
| Kotak biru | Min · Acuan · Maks historis, berapa kali item muncul di PH, harga terakhir + klien + tanggal + No PH |
| Label warna | Sumber harga; hijau/merah/kuning = posisi terhadap range historis; margin aktual; luas m²; transport |
| + Gambar / foto bahan | Upload gambar untuk format 2, 3, 4 |
| ↑ ↓, Duplikat, Hapus | Urutkan, gandakan (enak untuk banyak toko), atau hapus item |
| **+ Tambah item** | Item baru. Lokasi / channel code / brand / kategori ikut item sebelumnya supaya cepat. |

### Ringkasan di bawah daftar item
- **Subtotal / Diskon / PPN / GRAND TOTAL**: angka yang tercetak.
- **Cek internal (tidak tercetak)**: total modal, laba kotor, markup, gross margin, laba setelah diskon, harga vs acuan rate card, jumlah item di luar range, dan item yang belum ada harga.

### Panel 4 · Penandatangan & Simpan

| Tombol | Fungsinya |
|---|---|
| Nama penandatangan, Jabatan | Tercetak di blok tanda tangan. **Tanda tangan tidak ditempel otomatis.** |
| **Unduh Excel** | File PH format terpilih, siap untuk Finance (No PH & tanggal di sel kuning, total pakai rumus) |
| ☐ Excel + sheet Internal | Menambah sheet modal, margin, cek range. **Jangan dikirim ke klien.** |
| **Unduh PDF** | PDF format terpilih untuk dikirim ke klien setelah disetujui |
| **Cetak** | Cetak langsung. Ukuran kertas otomatis portrait/landscape sesuai format. |
| Salin baris PH-MU2026 | Satu baris rekap (tanggal, No PH, proyek, client, PIC, area, DPP, PPN, grand total) untuk ditempel ke file rekap |
| Salin baris Unit Price | Satu baris per item untuk sheet Unit Price |
| Simpan draf (.json) / Buka draf… | Simpan PH yang belum selesai atau versi revisi, lalu buka lagi kapan saja (termasuk gambar & logo) |
| Kosongkan (PH baru) | Form kosong. Format, penandatangan, margin, dan logo tetap. |
| Pengaturan | Tarif PPN |

### Panel kanan · Pratinjau
- Tampilan PH persis seperti yang akan tercetak, berubah langsung saat mengetik.
- Format landscape (Rollout, Indicia, Manpower) otomatis lebih lebar.

---

## D. Cara kerja harga modal, margin, dan pajak

### 1. Tiga sumber harga, dengan urutan prioritas

```
Harga manual diisi?          → YA → harga = harga manual
        │ tidak
Modal / HPP diisi?           → YA → harga = Modal × (1 + Margin %)  (tanpa pembulatan ribuan)
        │ tidak
Item dari rate card?         → YA → harga = Harga Acuan rate card (median historis)
        │ tidak
Item baru → label merah, PH tidak bisa diunduh sampai harga diisi
```

### 2. Apa itu harga modal (HPP)?
**Modal / HPP (Harga Pokok)** = biaya Mata Utama untuk membuat 1 unit: bahan, produksi, ongkos vendor/subcon. Sumbernya:
- price list bahan dari purchasing;
- penawaran vendor/subcon;
- hitungan estimator untuk item custom.

Cara memasukkan:
- **per item**: ketik di kotak Modal / HPP; atau
- **sekali untuk semua**: isi kolom oranye **Modal/HPP** di database Excel lalu upload. Setiap kali item itu dipilih, modalnya langsung terisi.

> Rate card bawaan berisi **harga jual** historis, bukan modal. Selama Modal kosong, harga di PH = harga jual historis dan margin tidak bisa dihitung. Begitu modal diisi, margin mulai bekerja.

### 3. Margin di aplikasi ini = **markup atas modal**

```
Harga jual = Modal × (1 + Margin%)
```

| Modal | Margin | Hitungan | Harga jual | Laba |
|---|---|---|---|---|
| 1.000.000 | 25% | 1.000.000 × 1,25 | 1.250.000 | 250.000 |
| 1.000.000 | 0% | 1.000.000 × 1,00 | 1.000.000 | 0 (jual seharga modal) |
| 1.000.000 | 100% | 1.000.000 × 2,00 | 2.000.000 | 1.000.000 |
| 1.000.000 | 200% (maks) | 1.000.000 × 3,00 | 3.000.000 | 2.000.000 |
| 95.000 | 25% | 95.000 × 1,25 | 118.750 | 23.750 |

- **Margin default** (Panel 2) berlaku untuk semua item.
- **Margin % per item** menimpa default hanya untuk item itu. Misalnya produksi 25%, tapi instalasi 15%.
- Margin di luar 0–200% otomatis dibatasi, dan muncul label merah.

### 4. Markup vs gross margin (sering tertukar)
- **Markup** = laba ÷ **modal**. Ini yang diketik di aplikasi.
- **Gross margin** = laba ÷ **harga jual**. Biasa dipakai di laporan keuangan.

| Markup (diketik) | Gross margin (di laporan) |
|---|---|
| 10% | 9,1% |
| 16% | 13,8% |
| 19% | 16,0% |
| 20% | 16,7% |
| 25% | 20,0% |
| 50% | 33,3% |
| 100% | 50,0% |
| 200% | 66,7% |

Rumus konversi:
- gross margin = markup ÷ (1 + markup)
- markup = GM ÷ (1 − GM)

Kalau atasan bilang "margin aggregator ±16%", tanyakan dulu itu markup atau gross margin. Kalau gross margin 16%, yang diketik di aplikasi adalah **19%**. Kotak *Cek internal* menampilkan keduanya.

### 5. Harga manual dan margin aktual
Kalau harga sudah disepakati (mis. hasil negosiasi dengan Tower Media), isi **Harga manual**. Jika modal juga diisi, muncul label:

```
Margin aktual = (Harga − Modal) ÷ Modal
```

Contoh: modal 1.000.000, harga manual 1.100.000 → margin aktual 10%. Label merah kalau di bawah 0% (rugi).

### 6. Perhitungan per m²
Kalau **Unit = m2** dan **P & L (cm)** diisi:

```
Luas  = P × L ÷ 10.000          (cm → m²)
Total = Harga per m² × Luas × Qty
```

Contoh sticker chiller 60 × 180 cm, 4 pcs, harga Rp118.750/m²:
- Luas = 1,08 m²
- Total = 118.750 × 1,08 × 4 = **Rp513.000**

Kalau unit bukan m2, ukuran hanya informasi dan total = harga × qty.

### 7. Transport
Transport per baris **ditambahkan apa adanya** (tanpa margin, karena biaya titipan):

```
Total baris = Qty (atau Qty × Luas) × Harga + Transport
```

Kalau transport juga mau diberi margin, jadikan item sendiri dengan Modal + margin.

### 8. Diskon, PPN, Grand Total

```
TOTAL (Subtotal)      = Σ Total baris
DISKON                = angka diskon (Rp)
TOTAL SETELAH DISKON  = TOTAL − DISKON         (= DPP)
PPN 11%               = DPP × 11%  (dibulatkan ke rupiah)
GRAND TOTAL           = DPP + PPN
```

- NON PPN → baris PPN hilang.
- Diskon **mengurangi laba**, terlihat di *Cek internal → Laba setelah diskon*.

### 9. Label posisi harga terhadap rate card

| Label | Arti | Tindakan |
|---|---|---|
| Hijau "Dalam range historis" | Harga di antara Min dan Maks yang pernah dipakai | Aman |
| Merah "Di bawah min historis" | Lebih murah dari harga terendah sebelumnya | Cek modal & margin, jangan sampai rugi |
| Kuning "Di atas maks historis" | Lebih mahal dari biasanya | Siapkan alasan (bahan, ukuran, lokasi jauh) |

### 10. Contoh lengkap (Tower Media)
| Item | Hitungan | Total |
|---|---|---|
| 10 End Gondola, modal Rp6.200.000, margin 20% | Harga 7.440.000 × 10 | 74.400.000 |
| Install, harga manual Rp650.000 × 10 toko | | 6.500.000 |
| Transport 1 rit, modal 1.200.000, margin 10% | 1.320.000 | 1.320.000 |
| **TOTAL** | | **82.220.000** |
| PPN 11% | | 9.044.200 |
| **GRAND TOTAL** | | **91.264.200** |

Cek internal untuk item yang punya modal (End Gondola + Transport):
- Modal 63.200.000, jual 75.720.000.
- Laba 12.520.000 → markup 19,8%, gross margin 16,5%.

---

## E. Memperbarui database rate card
1. **Unduh database** → edit di Excel (ubah harga, tambah item, isi kolom oranye Modal/HPP). **Jangan ubah judul kolom.**
2. Pilih mode **Update** (biasa) atau **Ganti semua** → **Upload database…** → baca ringkasan → **Lanjutkan**.
3. Salah upload → **Kembali ke bawaan**.

Kolom wajib:
- Kategori;
- Nama Item;
- Harga Acuan **atau** Modal/HPP.

Kunci item = Kategori + Sub Kategori + Nama Item + Ukuran + Satuan. Angka boleh `1250000` atau `1.250.000`.

---

## F. Cara bikin HTML-nya

```
source/
├── build.py            ← perakit: menggabungkan semua file jadi 1 HTML
├── build_db.py         ← membuat rate card bawaan dari data historis (dipakai sekali)
├── src/
│   ├── index.html      ← kerangka halaman: panel, tombol, kotak isian
│   ├── style.css       ← tampilan: warna, tata letak, mode gelap, format cetak
│   ├── templates.js    ← 7 FORMAT PH: kolom, kepala surat, tanda tangan + pembuat pratinjau/PDF/Excel
│   ├── app.js          ← logika: database, upload, item, harga/margin/pajak, simpan
│   ├── logo.datauri.txt← logo Mata Utama (gambar sebagai teks base64)
│   └── vendor/         ← library open source (MIT): jsPDF, jsPDF-AutoTable, ExcelJS
└── data/
    ├── db_default.json ← rate card bawaan
    └── clients.json    ← daftar klien + saran lokasi/PIC
```

**Cara kerja perakit**:
- `index.html` punya penanda `/*@@STYLE@@*/`, `/*@@DATA@@*/`, `/*@@APP@@*/`, dan seterusnya.
- `build.py` mengganti tiap penanda dengan isi file terkait.
- Hasilnya satu file HTML ±2,3 MB yang bisa dibuka tanpa internet.

**Cara merakit ulang** (Mac):
1. Buka Terminal.
2. `cd` ke folder `source`.
3. Jalankan `python3 build.py`.
4. Hasilnya ada di `source/dist/`.

**Cara kerja format (templates.js)**:
- Setiap format adalah satu entri di `TPL`: nama, orientasi kertas, warna header, jenis kepala surat, daftar kolom (judul, lebar PDF, lebar Excel, rata kiri/tengah/kanan), dan jenis tanda tangan.
- `buildDoc()` menyusun "model dokumen" dari isian.
- Model yang sama dicetak oleh `docHTML()` (pratinjau), `docPDF()` (PDF), dan `docXLSX()` (Excel). Ketiganya selalu sama.

**Menambah format baru**:
1. Salin satu entri di `TPL`, ganti nama kuncinya.
2. Ubah kolom-kolomnya.
3. Tambahkan `<option>` di `index.html` (kotak "Format / template PH").
4. Jalankan `python3 build.py`.

**Contoh perubahan umum**

| Ingin mengubah | File | Cari |
|---|---|---|
| Margin default 25% | app.js | `margin:'25'` |
| Penandatangan default | app.js | `ttd:'Berley Angga Putra'` |
| Judul / lebar kolom suatu format | templates.js | nama format, mis. `indicia:` |
| Warna header tabel | templates.js | `head:'FFFF00'` |
| Kalimat pembuka surat | app.js | `const kalimat` |
| Daftar klien | data/clients.json | |

Harga baru **tidak perlu** merakit ulang. Cukup Upload database di aplikasi.

---

## G. Catatan penting
- Draf, logo klien, dan database hasil upload tersimpan di **browser** yang dipakai. Pindah laptop/browser = upload database lagi dan buka draf .json. Simpan cadangan di folder Quotation.
- Kalau draf banyak gambar dan penyimpanan browser penuh, gambar tidak ikut tersimpan otomatis. Pakai **Simpan draf (.json)** yang selalu menyimpan gambar.
- **Sheet Internal** dan kotak **Cek internal** berisi modal dan margin. Jangan sampai terkirim ke klien.
- Tower Media (TOP 1 bulan, margin lebih tipis): selalu lihat *Cek internal* dan label merah sebelum PH dikirim ke atasan.

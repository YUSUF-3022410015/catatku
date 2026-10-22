# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## CatatKu — Aplikasi Pengelola Kegiatan Pribadi Berbantuan AI

**Versi:** 2.1 (baseline development; strategi AI diperjelas)  
**Status:** Baseline development; lingkup dibekukan dan hanya berubah lewat keputusan tertulis  
**Tanggal:** 22 Oktober 2026  
**Nama produk:** CatatKu (nama kerja)  
**Platform:** Web responsif yang dapat dipasang sebagai Progressive Web App (PWA)  
**Target pengguna:** Masyarakat umum; validasi awal dapat dilakukan kepada mahasiswa UISI  
**Prinsip biaya:** Mengutamakan open-source dan paket gratis, tanpa menjanjikan biaya Rp0 untuk semua skala penggunaan.

### Riwayat perubahan

> **v1.5** adalah PRD asli yang diunggah. v1.6, v1.7, dan v1.8 adalah versi antara yang dikirim sebelumnya; tabel ini mencatat perubahan per versi secara kumulatif.

| # | Versi | Perubahan | Bagian |
|---|---|---|---|
| 1 | 1.6 | Menambah analisis alternatif dan diferensiasi produk | 2.1 |
| 2 | 1.6 | Identitas instalasi: API wajib satu origin dengan frontend; risiko iOS/PWA dicatat | 9, 17, 18 |
| 3 | 1.6 | Ekspor/impor data dinaikkan menjadi **Must** dan formatnya didefinisikan | 6.1, 10, 12 |
| 4 | 1.6 | Aturan pengingat diubah: jendela pengingat harian + pengingat sebelum mulai (menggantikan "harian sampai tanggal kegiatan tanpa batas") | 1, 7D, 11 |
| 5 | 1.6 | Voice Note: ambang tekan-tahan dipersingkat, status disamakan menjadi *MVP kondisional*, kriteria kelayakan ditambahkan | 6.1, 7B, 10 |
| 6 | 1.6 | Perlindungan penyalahgunaan endpoint AI (rate limit, batas global, Turnstile) | 9, 13, 17 |
| 7 | 1.6 | Poster dengan banyak tanggal: kandidat tanggal berlabel dan opsi kegiatan terpisah | 7C, 10, 12 |
| 8 | 1.6 | Metrik keberhasilan dan target performa diberi angka usulan | 13, 15 |
| 9 | 1.6 | Perbaikan model data: `anonymous_profile_id` → `installation_id`; status tampilan diturunkan dari waktu | 12 |
| 10 | 1.6 | Pernyataan "tanpa login" didefinisikan sekali (Bagian 3) dan dirujuk di tempat lain; dokumen dipadatkan | seluruhnya |
| 11 | 1.6 | Menambah Tahap Spike Teknis sebelum MVP dan fitur "Hapus semua data saya" | 10, 18 |
| 12 | 1.7 | Menambah Bagian 21: alur pengembangan, struktur repo, Git, environment, CI/CD, breakdown tugas, dan Definition of Done | 21 |
| 13 | 1.7 | Menambah Obsidian sebagai alat dokumentasi tim **khusus dokumentasi**, dari ide awal sampai hasil jadi (vault di `docs/`, struktur, template, aturan privasi, dokumentasi per tahap) | 9, 21.6 |
| 14 | 1.7 | Koreksi arsitektur hosting: Cron Triggers tidak tersedia di Pages Functions (perlu diverifikasi), sehingga disarankan satu Worker dengan Static Assets | 9, 18, 21.2 |
| 15 | 1.8 | Arsitektur **local-first**: data utama di perangkat (IndexedDB), ID dibuat klien, server sebagai cermin untuk pengingat | 3, 9, 12 |
| 16 | 1.8 | Offline masuk MVP secara bertingkat: lihat serta tambah/edit/selesai/hapus tanpa internet dengan antrean sinkron; unggah poster dan Voice Note tetap butuh internet | 6.1, 7G, 10 |
| 17 | 1.8 | Aturan sinkronisasi, konflik (nomor revisi), tombstone, dan pengingat yang belum tersinkron | 11, 12 |
| 18 | 1.8 | Gerbang keputusan offline di Spike Teknis (turun ke baca-saja bila gagal), epik E2b, risiko, metrik, dan skenario uji offline | 15, 16, 17, 18, 21 |
| 19 | 1.9 | Kriteria penerimaan offline mengikuti gerbang Spike: offline baca wajib; tambah/edit offline wajib hanya bila gerbang lolos (Bagian 1, 15, 16, 20) | 1, 15, 16, 20 |
| 20 | 1.9 | **Spike Pengingat** menjadi prototipe pertama dan gerbang pembangunan; batas Workers Free (CPU 10 ms per Cron, 50 subrequest per pemanggilan) dimasukkan; `next_reminder_at` terindeks; opsi fallback dan risiko biaya | 9, 12, 17, 18, 19 |
| 21 | 1.9 | Metrik "0 notifikasi setelah selesai/dibatalkan" diukur berdasarkan status di server; keterlambatan sinkron dicatat sebagai keterbatasan | 15 |
| 22 | 1.9 | Privasi: pemberitahuan saat mengaktifkan pengingat (FR-30), masa simpan salinan server (FR-31), pernyataan bahwa aplikasi tidak sepenuhnya lokal, opsi minimisasi data server | 3, 10, 12, 14 |
| 23 | 1.9 | Tahap 3 dipecah menjadi lima milestone (M1 sampai M5) dengan hasil yang dapat diperiksa; epik dan dependensi disesuaikan | 18, 21.7 |
| 24 | 1.9 | Riwayat perubahan dipisah per versi dan sumber versi dijelaskan | Riwayat perubahan |
| 25 | 2.0 | Keputusan final untuk development (tabel di Bagian 19) dan pembekuan lingkup | 19, 21.9 |
| 26 | 2.0 | FR-23 Hapus semua data saya dinaikkan menjadi **Must** | 10 |
| 27 | 2.0 | Alur offline disamakan di seluruh dokumen: offline baca wajib; tambah/edit offline hanya jika gerbang Spike lolos | 6.1, 7G, 9, 10, 12, 13 |
| 28 | 2.0 | FR-12b pengingat sebelum mulai tetap Should; pengingat harian diprioritaskan dan dibangun lebih dulu | 1, 6.1, 7D, 10, 11, 16, 18 |
| 29 | 2.0 | Urutan kerja dipertegas: M1 → M2 → Spike Pengingat → M3 sampai M5; spike dijadwalkan tepat sebelum milestone yang bergantung padanya | 18, 21.7 |
| 30 | 2.0 | Hosting final: Cloudflare Workers + Static Assets (Pages + Worker Cron hanya fallback bila spike gagal) | 9, 21.2 |
| 31 | 2.0 | Model kerja product owner + coding agent (Hermes); dokumentasi Obsidian dua berkas (`projek/` dan `arsip/`) di vault pribadi; vault tidak dipublikasikan | 9, 21.1, 21.3, 21.6, 21.9 |
| 32 | 2.1 | Strategi pemilihan model AI: Hermes mengevaluasi kandidat berdasarkan ketersediaan, kualitas, latensi, kuota, privasi, dan ketentuan penggunaan; model aktif dikunci melalui konfigurasi setelah pengujian | 1, 7C, 9.1, 10, 14, 18, 19, 21.4, 21.9 |
| 33 | 2.1 | Menambahkan gerbang kesesuaian ketentuan provider AI sebelum pemakaian produksi publik, termasuk pemeriksaan batasan Gemini API yang berlaku saat ini | 9.1, 14, 18, 21.7 |
| 34 | 2.1 | Menegaskan konfigurasi `GEMINI_API_KEY` sebagai secret, `GEMINI_MODEL` sebagai konfigurasi non-secret, dan larangan fallback berbayar otomatis | 9.1, 21.4, 21.9 |
| 35 | 2.1 | Menambahkan pemberitahuan sebelum poster dikirim ke AI eksternal dan memperjelas fallback OCR lokal/manual | 7C, 10, 13, 14, 17 |
| 36 | 2.1 | Merapikan kriteria mode offline, konsistensi pengingat sebelum mulai yang berstatus Should, penghapusan semua data, retensi server, dan contoh ekspor/impor lengkap | 7G, 10, 11, 12, 14, 16, 21.7 |

> Angka target pada dokumen ini adalah **usulan awal** dan perlu ditetapkan ulang setelah baseline pengujian prototipe.

---

## 1. Ringkasan Produk

CatatKu adalah aplikasi pengelola jadwal dan kegiatan pribadi yang membantu pengguna mencatat kegiatan, melihatnya dalam kalender, menerima pengingat otomatis, dan menyimpan riwayat kegiatan. Kegiatan dapat dibuat lewat teks, input suara (Voice Note), dan unggahan poster/foto acara.

Pada tombol **Tambah Kegiatan**, tap singkat membuka input teks; tekan-tahan sebentar (sekitar 0,8 detik, dikalibrasi saat uji kegunaan) masuk ke mode Voice Note. Setelah mode suara aktif, pengguna dapat melepas tombol, berbicara, lalu menekan Stop. Hasil transkripsi menjadi draf yang dapat dikoreksi sebelum disimpan. AI/OCR juga mengambil informasi poster (nama acara, tanggal, waktu, lokasi, tenggat), dan hasilnya wajib diperiksa pengguna sebelum disimpan.

Arah desain adalah **soft glassmorphism** dengan kalender sebagai fokus dashboard, tema **System, Light, Dark**, dan tata letak responsif untuk HP, tablet, dan desktop.

**Pemilihan AI:** model produksi belum ditetapkan. Hermes mengevaluasi kandidat berdasarkan ketentuan provider yang sesuai, akses model yang tersedia, hasil benchmark poster Indonesia, latensi, kuota gratis, dan privasi. Nama model dikonfigurasi di backend setelah keputusan dicatat; tidak ada fallback otomatis ke layanan berbayar.

**Pengingat** bersifat opsional per kegiatan dan memiliki dua jenis yang dapat dipakai bersamaan:
- **Pengingat harian** pada jam pilihan, dalam jendela hari tertentu sebelum kegiatan (default 7 hari terakhir; pilihan 3, 7, 14 hari, atau sejak dibuat). Maksimal satu per hari.
- **Pengingat sebelum mulai** untuk kegiatan berjam (misalnya 30 menit atau 1 jam sebelumnya). Berstatus *Should*: dibangun setelah pengingat harian stabil.

Pengingat berhenti otomatis setelah kegiatan lewat, selesai, atau dibatalkan; kegiatan tetap tersimpan di Riwayat.

**Offline (local-first):** setelah kunjungan pertama, data kegiatan disimpan di perangkat sehingga kalender dan agenda dapat dibuka tanpa internet (wajib). Bila Spike Teknis lolos, kegiatan juga dapat ditambah, diedit, diselesaikan, dan dihapus tanpa internet; perubahan masuk antrean dan tersinkron otomatis saat online. **Yang tetap butuh internet:** unggah poster (AI/OCR), Voice Note berbasis layanan online, dan pengiriman pengingat (dijadwalkan server, jadi kegiatan yang belum tersinkron belum pasti diingatkan).

## 2. Latar Belakang dan Pernyataan Masalah

Informasi jadwal datang dari poster digital, pengumuman, media sosial, grup percakapan, atau lisan. Memasukkannya secara manual memakan waktu, dan jadwal mudah terlupakan jika catatan tersebar. **Ini hipotesis awal, bukan temuan lapangan.** Masalah baru dianggap valid setelah observasi dan wawancara calon pengguna.

### Pertanyaan validasi
1. Dari mana calon pengguna biasanya menerima informasi kegiatan dan tenggat?
2. Bagaimana mereka mencatat serta mengingat kegiatan saat ini?
3. Bagian mana yang paling merepotkan ketika mengubah poster menjadi jadwal?
4. Kapan mereka ingin diingatkan, seberapa sering, dan apakah lebih suka pengingat harian atau "sebelum mulai"?
5. Apakah mereka bersedia memberi izin notifikasi browser?
6. Apakah penggunaan tanpa login dan tanpa nomor HP sesuai kebutuhan, dan seberapa besar kekhawatiran mereka soal data hilang?
7. Apa yang saat ini mereka pakai (kalender bawaan, Google Calendar, catatan, chat ke diri sendiri), dan apa yang kurang?
8. Seberapa sering mereka perlu mencatat atau melihat jadwal saat tidak ada sinyal, dan di situasi apa? (menentukan prioritas offline tambah/edit)

### 2.1 Alternatif yang ada dan diferensiasi

| Alternatif | Kekuatan | Celah yang mungkin dimanfaatkan CatatKu (hipotesis, perlu diverifikasi) |
|---|---|---|
| Google Calendar / kalender bawaan HP | Mapan, sinkron, terintegrasi | Umumnya butuh input manual per acara; pengingat per acara bukan "seri harian yang berhenti sendiri" |
| Aplikasi catatan/tugas (Notion, Todoist, dsb.) | Fleksibel | Bukan kalender-sentris; setup lebih berat |
| Asisten AI umum / fitur baca screenshot | Dapat membaca gambar | Bukan alur khusus poster → draf → konfirmasi → pengingat |
| Chat ke diri sendiri / screenshot di galeri | Tanpa usaha | Tidak ada pengingat, mudah tenggelam |

**Proposisi nilai:** ubah poster atau ucapan menjadi jadwal dalam hitungan detik dengan konfirmasi pengguna, tanpa akun, lalu pengingat yang berhenti sendiri.

**Diferensiasi yang akan diuji:** (1) alur poster → draf yang cepat dan akurat untuk poster berbahasa Indonesia; (2) tanpa login; (3) pengingat yang tidak spam.
Tim wajib memverifikasi tabel ini lewat wawancara (pertanyaan 7) dan pengujian alternatif langsung sebelum menjadikannya klaim publik.

## 3. Visi, Tujuan, dan Prinsip Produk

### Visi
Membantu pengguna mengelola kegiatan pribadi melalui kalender yang mudah dipahami, pengingat tepat waktu, dan input kegiatan yang praktis.

### Tujuan
- Memusatkan kegiatan dan riwayat dalam satu tempat.
- Mempermudah pembuatan jadwal dari poster dan suara melalui bantuan AI.
- Menampilkan kalender harian, mingguan, dan bulanan.
- Mengingatkan pengguna secara otomatis tanpa spam dan berhenti setelah kegiatan terlewat.
- Desain sederhana, responsif, dan nyaman.
- Mengutamakan open-source dan paket gratis selama dalam kuota.

### Prinsip
- **AI memberi draf, bukan keputusan final.** Pengguna mengonfirmasi sebelum menyimpan.
- Data yang tidak terbaca tidak boleh dikarang; dibiarkan kosong dan ditandai.
- Kegiatan yang telah lewat tidak otomatis dihapus.
- Izin notifikasi dan mikrofon diminta jelas dan hanya saat dibutuhkan.
- Tidak menjanjikan pengingat lintas perangkat atau notifikasi saat aplikasi tertutup sebelum diuji pada browser dan perangkat target.
- Pengguna tetap dapat mencatat manual ketika AI tidak tersedia.
- **Local-first:** sumber data utama ada di perangkat; server adalah cermin untuk keperluan pengingat. Aplikasi tidak boleh rusak atau menahan pengguna saat sinyal buruk.
- Status sinkronisasi dan keterbatasan pengingat ditampilkan jujur; jangan tampil seolah pengingat pasti terjadwal bila belum tersinkron.

### Prinsip Akses Tanpa Akun (definisi kanonik)
> CatatKu tidak memiliki halaman daftar/login dan tidak meminta akun, email, password, nomor HP, OTP, maupun verifikasi SMS. Nama tampilan bersifat opsional.
>
> Pada penggunaan pertama, aplikasi membuat **identitas instalasi** acak di browser/perangkat. Ini bukan akun dan tidak memerlukan tindakan pengguna; fungsinya menghubungkan kegiatan dengan instalasi tersebut agar backend dapat memproses pengingat push. Karena itu aplikasi **tidak sepenuhnya lokal**: salinan kegiatan (setidaknya yang berpengingat) disimpan di server, dan hal ini dijelaskan kepada pengguna saat mengaktifkan pengingat.
>
> Data **tidak** tersinkron ke perangkat lain. Jika data browser dihapus atau perangkat hilang, pemulihan hanya mungkin lewat **file cadangan ekspor**. Di iOS, instalasi PWA di Home Screen dapat memiliki penyimpanan terpisah dari Safari (lihat Bagian 17), sehingga pengguna perlu diarahkan memakai ekspor/impor saat berpindah.

Bagian lain dokumen merujuk ke prinsip ini sebagai **"Akses Tanpa Akun"**.

## 4. Target Pengguna dan Persona

**Target utama:** masyarakat umum yang ingin mengatur kegiatan pribadi (mahasiswa, pekerja, freelancer, orang tua, anggota organisasi).

**Segmen validasi awal:** mahasiswa UISI karena mudah dijangkau. Temuan tidak otomatis mewakili seluruh masyarakat.

**Persona asumsi:** individu dengan beberapa kegiatan dan tenggat yang perlu diingat. Persona dipakai untuk prototipe dan harus diperbaiki setelah wawancara nyata.

## 5. Stakeholder

| Stakeholder | Peran/kepentingan |
|---|---|
| Pengguna | Membuat, mengatur, mengingat, dan melihat riwayat kegiatan |
| Tim proyek/pengembang | Meneliti, merancang, membangun, menguji, memelihara |
| Dosen/pembimbing | Memberi arahan dan mengevaluasi proyek kuliah |
| Penyedia hosting/database | Menyajikan aplikasi dan menyimpan data |
| Penyedia AI/OCR | Mengekstrak informasi poster, jika layanan eksternal dipakai |
| Browser/layanan Web Push | Menyampaikan notifikasi sesuai dukungan platform dan izin pengguna |

## 6. Ruang Lingkup

### 6.1 MVP — versi pertama

**Inti (wajib):**
1. Web responsif untuk HP, tablet, dan desktop (PWA).
2. Membuat, melihat, mengedit, menyelesaikan, membatalkan, dan menghapus kegiatan.
3. Input manual melalui teks.
4. Unggah poster/foto pada formulir Tambah Kegiatan; setelah berkas valid dipilih, OCR/AI otomatis berjalan dan menyiapkan draf.
5. Halaman pemeriksaan draf; pengguna mengoreksi sebelum menyimpan, termasuk memilih tanggal utama bila poster memuat banyak tanggal.
6. Kalender bulanan sebagai tampilan utama, opsi mingguan dan harian.
7. Agenda hari ini dan kegiatan terdekat.
8. Pengingat push harian (dengan jendela hari), jam dapat diatur. Pengingat sebelum mulai (FR-12b) berstatus *Should* dan dikerjakan setelah pengingat harian stabil.
9. Pengingat berhenti otomatis saat kegiatan selesai, dibatalkan, atau terlewat.
10. Riwayat kegiatan selesai/terlewat; tidak dihapus otomatis.
11. Tema System, Light, Dark.
12. Akses Tanpa Akun (identitas instalasi otomatis).
13. Service Worker/PWA dan alur izin notifikasi.
14. **Ekspor dan impor data (JSON)** sebagai satu-satunya jalur pemulihan.
15. Hapus semua data saya (Pengaturan).
16. **Offline-first bertingkat:** aplikasi dan data kegiatan tersedia tanpa internet (**baca dan ekspor: wajib**). **Tambah/edit/selesai/batal/hapus saat offline beserta antrean sinkron hanya wajib jika gerbang Spike lolos**; jika tidak lolos, semua aksi yang mengubah data dinonaktifkan saat offline dengan pesan jelas dan MVP berstatus offline baca-saja dengan arsitektur yang sama. Indikator koneksi/sinkron selalu ditampilkan.

**MVP kondisional (dirilis hanya jika lolos uji kelayakan, lihat FR-20):**
17. Tombol Tambah Kegiatan dengan tekan-tahan ke mode Voice Note dan transkripsi menjadi draf. Tombol mikrofon berlabel pada formulir tetap menjadi jalur utama yang mudah ditemukan.

### 6.2 Fase lanjutan
- Sinkronisasi lintas perangkat melalui kode pairing yang dirancang terpisah, tanpa akun atau nomor HP.
- Sinkronisasi ke Google Calendar atau kalender eksternal.
- Jadwal berulang dan berbagi kegiatan.
- Deteksi bentrok yang lebih lengkap.
- Lampiran poster permanen (jika kebutuhan penyimpanan dan privasi sudah ditetapkan).
- Penyempurnaan offline: Background Sync yang andal di semua browser, penanganan sinkron gagal berulang pada antrean panjang, pemulihan setelah browser menghapus data lokal, dan alternatif AI yang berjalan di perangkat.

### 6.3 Di luar ruang lingkup MVP
- Daftar/login, akun, email, password, nomor HP, OTP, verifikasi SMS.
- Notifikasi WhatsApp atau SMS.
- Membaca pesan WhatsApp/email otomatis.
- Penyimpanan lintas perangkat tanpa mekanisme penghubung pengguna.
- Menyimpan kegiatan dari poster tanpa pemeriksaan pengguna.
- Aplikasi native Android/iOS terpisah.
- Pembayaran, tiket, atau pendaftaran acara.

## 7. Alur Pengguna Utama

### A. Membuat kegiatan manual
1. Pengguna menekan **Tambah Kegiatan**.
2. Mengisi judul, tanggal, waktu (jika ada), lokasi/catatan (opsional), dan pengaturan pengingat.
3. Sistem memvalidasi isian.
4. Jika pengingat diaktifkan dan izin belum diberikan, aplikasi meminta izin notifikasi dengan penjelasan singkat.
5. Kegiatan disimpan dan muncul di kalender serta agenda.

### B. Membuat kegiatan dengan Voice Note *(kondisional)*
1. Pengguna memakai **tombol mikrofon berlabel** di formulir, atau menekan-tahan tombol Tambah Kegiatan (sekitar 0,8 detik).
2. Selama menahan, tampilkan indikator progress. Cegah menu konteks/seleksi teks bawaan browser akibat long-press. Setelah mode aktif, pengguna boleh melepas tombol; perekaman berlanjut sampai menekan **Stop** atau **Batal**.
3. Izin mikrofon diminta saat diperlukan. Jika ditolak atau tidak didukung, pengguna diberi penjelasan dan tetap dapat mengetik.
4. Ucapan menjadi transkripsi, lalu disusun sebagai draf. Data yang tidak disebut dibiarkan kosong.
5. Pengguna memeriksa dan memperbaiki draf sebelum **Simpan Kegiatan**.
6. Audio mentah tidak disimpan permanen. Antarmuka menjelaskan bahwa browser/layanan pengenalan suara dapat memproses audio di server penyedia.

### C. Membuat kegiatan dari poster
1. Dari formulir Tambah Kegiatan, pengguna memilih **Unggah poster/foto**. Tidak ada mode atau tombol "AI" terpisah.
2. Sistem memvalidasi jenis dan ukuran berkas (maks. 5 MB; gambar diperkecil di sisi klien, misalnya sisi terpanjang ≤ 1600 px). Sebelum gambar pertama kali dikirim ke provider eksternal, pengguna melihat pemberitahuan pemrosesan data dan dapat menyetujui atau membatalkan. Setelah pemberitahuan diterima, unggahan valid berikutnya langsung memulai proses OCR/AI sesuai konfigurasi.
3. OCR/AI yang provider-nya telah lolos pemeriksaan ketentuan penggunaan mengekstrak nama acara, lokasi, serta **semua kandidat tanggal/waktu yang dapat dikenali beserta labelnya** (acara, pendaftaran, tenggat, lainnya). Jika provider eksternal tidak dapat digunakan, gunakan OCR lokal yang telah diuji atau arahkan pengguna ke formulir manual.
4. Sistem menampilkan indikator proses, lalu mengisi formulir. Tanggal utama dipilih otomatis berdasarkan label "acara" bila ada; pengguna dapat mengganti dari daftar kandidat. Kolom kosong atau ambigu ditandai.
5. Untuk tanggal bukan-acara (misalnya batas pendaftaran), tersedia aksi **"Tambahkan sebagai kegiatan terpisah"** yang membuat draf kedua.
6. Pengguna meninjau, memilih pengingat, lalu menekan **Simpan Kegiatan**. Ekstraksi tidak pernah menyimpan otomatis.
7. Jika OCR/AI gagal atau kuota habis, tampilkan pesan jelas dan pengguna melanjutkan dengan formulir manual tanpa mengulang alur. Jika tahun tidak tertulis, sistem mengusulkan tahun berjalan/terdekat dan menandainya untuk diperiksa.

### D. Pengingat dan riwayat
1. Pengguna memilih jenis pengingat: **harian** (jam + jendela hari) dan/atau **sebelum mulai** (offset, hanya untuk kegiatan berjam; tersedia bila FR-12b dibangun).
2. Pengingat harian dikirim paling banyak sekali per hari selama kegiatan masih akan datang dan berada dalam jendela hari.
3. Pada hari kegiatan, pengingat harian hanya dikirim jika waktu mulai belum lewat. Untuk kegiatan tanpa jam, tanggal tersebut menjadi hari pengingat terakhir.
4. *(FR-12b, Should)* Pengingat sebelum mulai dikirim sekali pada waktu (mulai − offset), jika belum lewat.
5. Setelah kegiatan lewat, notifikasi berhenti dan status tampil **Terlewat** bila belum diselesaikan/dibatalkan.
6. Kegiatan tetap terlihat di **Riwayat**.
7. **Selesai** atau **Dibatalkan** menghentikan semua pengingat seketika.

### E. Melihat kalender
1. Dashboard menampilkan tanggal saat ini, kalender, dan agenda terdekat.
2. Memilih tanggal menampilkan kegiatan hari itu.
3. Detail kegiatan dapat dibuka untuk mengubah waktu, catatan, status, atau pengingat.

### F. Cadangan dan pemulihan
1. Di Pengaturan, pengguna memilih **Ekspor data** dan mengunduh berkas JSON.
2. Di perangkat/instalasi baru, pengguna memilih **Impor data** dan memilih berkas.
3. Sistem memvalidasi versi skema, menampilkan ringkasan (jumlah kegiatan), lalu menggabungkan data tanpa menggandakan kegiatan yang sudah ada. Pengingat dijadwal ulang; izin notifikasi harus diberikan ulang di instalasi baru.

### G. Memakai aplikasi saat offline
1. Setelah kunjungan pertama (online), aplikasi dan data kegiatan tersimpan di perangkat; aplikasi dapat dibuka tanpa internet. Pada pembukaan pertama kali, pengguna harus online sekali agar identitas instalasi dan cache aplikasi siap.
2. Saat offline, pengguna dapat melihat kalender, agenda, dan riwayat serta mengekspor data (wajib). **Jika gerbang Spike lolos**, pengguna juga dapat menambah, mengedit, menyelesaikan, membatalkan, dan menghapus kegiatan; perubahan langsung tersimpan lokal dan masuk antrean dengan status **Menunggu sinkron**. **Jika tidak lolos**, semua tindakan yang mengubah data (tambah, edit, selesai, batal, dan hapus) dinonaktifkan saat offline dengan pesan jelas; aplikasi berada dalam mode offline baca-saja.
3. Fitur yang membutuhkan internet dinonaktifkan dengan pesan jelas: **unggah poster (AI/OCR)** dan Voice Note berbasis layanan online. Pengguna diarahkan memakai formulir manual.
4. Kegiatan berstatus Menunggu sinkron ditandai. Aplikasi menjelaskan bahwa pengingatnya baru dijadwalkan atau diperbarui di server setelah tersinkron.
5. Saat koneksi kembali atau aplikasi dibuka, sinkronisasi berjalan otomatis; indikator berubah menjadi **Tersinkron**. Jika gagal, tampil **Gagal sinkron** dengan opsi coba lagi; data lokal tidak hilang.

## 8. Desain UI/UX

### 8.1 Design Direction
**Soft Glassmorphism — Calendar First.** Modern, tenang, elegan, personal. Efek kaca dipakai terukur pada panel, sidebar, header, dan dialog; area kalender memakai permukaan cukup solid agar terbaca.

### 8.2 Layout
- **Desktop:** sidebar kiri; header berisi tanggal/pencarian/aksi cepat; kalender dominan; agenda terdekat di panel samping.
- **Tablet:** sidebar dapat diperkecil; agenda pindah ke bawah kalender.
- **Mobile:** navigasi bawah atau menu ringkas; kalender dipadatkan; agenda berupa daftar; formulir sebagai halaman atau bottom sheet.
- Tombol **Tambah Kegiatan** harus mudah ditemukan. Formulir menyediakan **Unggah poster/foto** dan (jika Voice Note aktif) **tombol mikrofon** yang terlihat.

### 8.3 Theme System
- **System:** mengikuti preferensi perangkat.
- **Light:** latar terang, aksen lavender/violet.
- **Dark:** latar navy-keunguan gelap, aksen violet lebih terang.

Token awal (dapat disesuaikan): Aksen Light `#6258D9`; Aksen Dark `#A69BFF`; Teks Light `#242238`; Teks Dark `#F4F2FF`. Border dan permukaan kaca harus berkontras cukup.

### 8.4 Typography
Font utama Inter atau sans-serif terbuka setara. Judul desktop ±28 px, mobile ±23 px; judul panel ±17–18 px; isi dan waktu ±14–16 px. Bobot tebal secukupnya.

### 8.5 Komponen utama
- Kalender bulanan/mingguan/harian dan label kegiatan yang tidak membuat tanggal padat.
- Kartu agenda terdekat dan formulir kegiatan.
- Alur unggah poster, pemilih kandidat tanggal, dan pemeriksaan draf.
- Pengaturan pengingat (jenis, jam, jendela hari, offset) beserta status izin notifikasi.
- Tombol Tambah Kegiatan (tap = teks; tekan-tahan = Voice Note bila aktif); tampilan status rekaman, indikator suara, Stop/Batal, transkripsi yang dapat diedit.
- Riwayat; status tampilan: Akan Datang, Sedang Berlangsung, Selesai, Terlewat, Dibatalkan.
- Layar Ekspor/Impor dan Hapus semua data.
- Keadaan kosong, loading, sukses, dan error yang jelas.
- Indikator status koneksi dan sinkronisasi (Online, Offline, Menunggu sinkron, Tersinkron, Gagal sinkron), serta penanda per kegiatan yang belum tersinkron.

### 8.6 Animation
Singkat dan ringan (150–250 ms) untuk tombol, dialog, panel. Indikator saat AI memproses poster. Hindari animasi terus-menerus dan blur berlebihan. Hormati preferensi `prefers-reduced-motion`.

### 8.7 Navigation
Dashboard · Kalender · Kegiatan · Riwayat · Pengaturan (tema, notifikasi, ekspor/impor, hapus data). Pada mobile gunakan navigasi bawah atau menu hemat ruang.

## 9. Tech Stack dan Arsitektur Awal

Stack direkomendasikan berdasarkan kebutuhan proyek, kemampuan tim, dan target paket gratis. Implementasi akhir diuji terhadap kuota, ketentuan layanan, dan kebutuhan nyata.

| Lapisan | Teknologi rekomendasi | Fungsi |
|---|---|---|
| Frontend | React + Vite + TypeScript | Antarmuka web |
| Styling | Tailwind CSS | Layout dan komponen visual |
| PWA | `vite-plugin-pwa` + Service Worker | Instalasi, cache app shell untuk offline, dan penerimaan Push API |
| Penyimpanan lokal | IndexedDB (pustaka pembungkus seperti Dexie bersifat opsional) | Sumber data utama di perangkat dan antrean perubahan offline |
| Kalender | Komponen open-source atau custom | Tampilan bulanan/mingguan/harian |
| Hosting frontend | Cloudflare Workers Static Assets (keputusan final) | Menerbitkan aset web |
| Backend | Cloudflare Workers (satu Worker dengan Static Assets; keputusan final, lihat 21.2) | API, identitas instalasi, aturan pengingat, integrasi AI |
| Database | Cloudflare D1 | Kegiatan, status, jadwal pengingat, push subscription |
| Penjadwalan | Cloudflare Cron Triggers | Memeriksa pengingat yang jatuh tempo |
| Notifikasi | Web Push API + Service Worker | Notifikasi sistem tanpa nomor HP |
| Input suara | Web Speech API `SpeechRecognition` bila tersedia (bahasa `id-ID`) | Transkripsi untuk draf; fallback input teks |
| Ekstraksi poster | AI provider dipilih setelah gerbang ketentuan dan benchmark; Gemini API dievaluasi secara kondisional; OCR lokal (mis. Tesseract.js) dapat diuji sebagai fallback | Draf kegiatan dari poster |
| Anti-penyalahgunaan | Cloudflare Turnstile + rate limiting | Melindungi endpoint AI |
| Repositori | Git + GitHub | Version control, kolaborasi, review PR, backlog (Issues/Projects) |
| CI/CD | Integrasi Git Cloudflare dan/atau GitHub Actions | Lint, tes, build, deploy preview dan produksi |
| Dokumentasi | Obsidian (vault pribadi, di luar repo) + folder `docs/` di repo untuk dokumen aman-publik | Status proyek, riwayat pembuatan, PRD, ADR, spesifikasi API |

### 9.1 Strategi pemilihan model AI untuk poster

**Tujuan:** Hermes sebagai coding agent mengelola proses evaluasi kandidat model, tetapi model produksi ditetapkan melalui hasil pengujian dan pemeriksaan ketentuan provider. Hermes tidak menjadi komponen runtime CatatKu; aplikasi memanggil provider melalui backend.

**Urutan keputusan:**
1. **Gerbang ketentuan dan kelayakan provider.** Periksa dokumentasi model, API, paket gratis, kebijakan data, usia pengguna, jenis penggunaan yang diizinkan, wilayah, dan batasan aplikasi publik. Jangan memakai provider hanya karena API key berhasil.
2. **Daftar kandidat.** Hermes memeriksa katalog model dan akses API yang tersedia pada saat pengujian; jangan mengunci nama model dalam PRD sebelum tersedia bukti. Kandidat harus menerima gambar dan mengembalikan output terstruktur yang dibutuhkan.
3. **Benchmark.** Uji sekurang-kurangnya 30 poster berbahasa Indonesia yang aman untuk pengujian dan memiliki jawaban acuan. Ukur ketepatan judul, tanggal utama acara, waktu, lokasi, kemampuan membedakan tanggal pendaftaran/tenggat, latensi, tingkat kegagalan, dan penggunaan kuota. Jangan menggunakan poster yang berisi data pribadi atau rahasia tanpa dasar dan persetujuan yang sesuai.
4. **Rekomendasi Hermes.** Pilih kandidat yang lolos pemeriksaan ketentuan, memenuhi kualitas minimum, dan masih sesuai target biaya. Catat kandidat yang diuji, hasil metrik, alasan pemilihan, keterbatasan, tanggal, dan sumber resmi pada ADR.
5. **Konfigurasi produksi.** Setelah model dipilih, gunakan `GEMINI_MODEL` sebagai konfigurasi non-secret di backend. Perubahan model dilakukan secara terkontrol setelah evaluasi ulang; jangan berganti model secara dinamis pada setiap permintaan.
6. **Fallback.** Jika provider/model tidak memenuhi ketentuan, tidak tersedia di kuota gratis, gagal, atau kuotanya habis, jangan beralih otomatis ke model/layanan berbayar. Gunakan OCR lokal jika kelayakannya terbukti atau tampilkan alur input manual. Draf yang tidak tervalidasi tidak boleh dianggap berhasil.

**Kunci API:** `GEMINI_API_KEY` adalah secret. Untuk pengembangan lokal simpan di `.dev.vars` yang masuk `.gitignore`; untuk produksi gunakan Cloudflare Worker Secrets. Jangan pernah menaruh key di frontend, `VITE_*`, repositori, log, PRD, atau dokumentasi Obsidian. File `.env.example` hanya boleh mencantumkan nama variabel dan placeholder tanpa nilai rahasia. Pemilik proyek menambahkan secret secara lokal/di dashboard; jangan meminta pengguna menempelkan key ke chat.

**Pemeriksaan ketentuan Gemini yang penting:** pada halaman resmi *Gemini API Additional Terms of Service* yang diperiksa untuk revisi ini (berlaku 23 Maret 2026), Google menyatakan pengguna API harus berusia minimal 18 tahun, API Clients tidak boleh diarahkan kepada atau kemungkinan diakses individu di bawah 18 tahun, dan layanan ditujukan bagi developer untuk penggunaan profesional/bisnis, bukan penggunaan konsumen. Karena CatatKu adalah aplikasi pengelola kegiatan pribadi untuk masyarakat umum, kesesuaian penggunaan ini **belum dapat diasumsikan**. Sebelum Gemini digunakan pada produksi publik, pemilik proyek/Hermes harus memastikan secara eksplisit bahwa jenis aplikasi, sasaran pengguna, dan penggunaan yang direncanakan sesuai dengan ketentuan resmi yang berlaku. Jika tidak sesuai atau tetap tidak jelas, jangan mengaktifkan Gemini di produksi publik; gunakan OCR lokal atau provider lain yang ketentuannya sesuai dan memiliki opsi gratis yang memadai; jika tidak ada, pertahankan input manual tanpa AI eksternal. API key yang dimiliki tidak mengesampingkan ketentuan provider.

**Privasi paket gratis:** halaman harga dan ketentuan resmi menyatakan bahwa konten yang dikirim lewat layanan Gemini tanpa biaya dapat digunakan untuk meningkatkan produk Google dan dapat ditinjau manusia; jangan kirim informasi sensitif, rahasia, atau pribadi. UI harus menjelaskan pengiriman gambar kepada pihak eksternal sebelum pengiriman pertama dan menyediakan pilihan membatalkan. Evaluasi ulang ketentuan sebelum rilis karena syarat, model, dan kuota dapat berubah.

Dokumentasi acuan resmi:
- Katalog model Gemini API: https://ai.google.dev/gemini-api/docs/models
- Harga dan batas tier Gemini API: https://ai.google.dev/gemini-api/docs/pricing
- Ketentuan tambahan Gemini API: https://ai.google.dev/gemini-api/terms

### Catatan arsitektur
- Gunakan HTTPS untuk PWA dan Web Push.
- Kunci API AI dan kunci VAPID disimpan sebagai secret di backend.
- **API dan frontend wajib satu origin** (dipenuhi oleh satu Worker dengan Static Assets). Frontend di `pages.dev` dengan API di `workers.dev` dianggap lintas-situs sehingga cookie identitas dapat diblokir browser.
- Karena pengingat memerlukan handler `scheduled` dan API/frontend harus satu origin, keputusan utama adalah **satu Worker dengan Static Assets** yang melayani frontend, API, dan `scheduled` sekaligus. Pages + Worker Cron terpisah hanya menjadi fallback jika Spike Pengingat dan verifikasi dokumentasi resmi menunjukkan pendekatan utama tidak layak.
- **Local-first:** UI membaca dan menulis ke IndexedDB; server menyimpan cermin kegiatan agar Cron dapat mengirim pengingat. ID kegiatan berupa UUID yang dibuat klien sehingga dapat dibuat offline tanpa bentrok. Gerbang Spike menentukan apakah penulisan saat offline diaktifkan bagi pengguna; rancangan data tetap local-first.
- **API sinkronisasi** (misalnya `POST /api/sync`) menerima batch operasi dari antrean. Setiap operasi memiliki `op_id` sehingga **idempoten** (dikirim ulang tidak menggandakan). Server menerima perubahan bila `revision` masuk lebih besar dari yang tersimpan; bila sama atau lebih kecil, server mengabaikannya dan mengembalikan versi server. Respons memuat status per operasi.
- Penghapusan memakai **tombstone** (`deleted_at`) agar dapat disinkronkan; tombstone dibersihkan setelah terkonfirmasi.
- Service Worker melakukan *precache* app shell dan tidak men-cache respons endpoint AI maupun sinkronisasi. Pembaruan Service Worker harus dirancang agar tidak memutus antrean yang sedang berjalan.
- Minta penyimpanan persisten dengan `navigator.storage.persist()`, tetapi tetap anggap data lokal dapat dihapus browser; ekspor berkala menjadi jaring pengaman.
- Background Sync API **tidak diandalkan** (dukungan browser tidak merata, terutama iOS; verifikasi). Sinkronisasi dipicu saat aplikasi dibuka, saat event koneksi kembali, dan lewat tombol manual.
- Identitas instalasi: token acak kuat; backend menyimpan hash-nya; cookie `Secure`, `HttpOnly`, `SameSite` sesuai rancangan. Token hanya mengidentifikasi instalasi, bukan akun. Tidak ada klaim sinkronisasi lintas perangkat pada MVP.
- **Endpoint AI tanpa login rentan menghabiskan kuota.** Terapkan: rate limit per instalasi (usulan: 10 poster/hari), batas global harian di backend, Turnstile pada unggahan, validasi tipe/ukuran, dan pesan fallback yang jelas ketika kuota habis.
- Pemanggilan provider AI hanya dilakukan dari Worker/backend. `GEMINI_MODEL` adalah konfigurasi non-secret; `GEMINI_API_KEY` hanya disimpan sebagai secret. Model produksi baru diaktifkan setelah gerbang ketentuan provider dan benchmark pada Bagian 9.1 lulus. Jangan membuat pemilihan model runtime otomatis yang dapat mengubah biaya atau ketentuan.
- Gambar poster dikirim ke penyedia AI hanya untuk ekstraksi dan tidak disimpan permanen kecuali dibutuhkan dan dijelaskan kepada pengguna.
- Cron Triggers berjalan dalam UTC. Gunakan satu Cron berfrekuensi pendek (usulan: tiap 1 sampai 5 menit; ditentukan pada Spike Pengingat) untuk memproses pengingat harian dan pengingat sebelum mulai; konversi waktu ke zona kegiatan (default `Asia/Jakarta`). Cron Triggers pada paket gratis dibatasi per akun (verifikasi; hanya satu yang dipakai). **Batas Workers Free yang memengaruhi pengingat (verifikasi di dokumentasi terbaru):** CPU time 10 ms per pemanggilan Cron dan 50 subrequest per pemanggilan, sehingga satu tick hanya dapat mengirim sedikit Web Push. Pengiriman massal pada jam yang sama (mis. 08.00) harus dibatch dan dibuktikan lewat Spike Pengingat.
- Pengiriman Web Push dari Workers memerlukan enkripsi payload dan VAPID. **Pastikan library yang dipilih kompatibel dengan runtime Workers** (WebCrypto) pada Spike Teknis.
- Paket gratis bukan jaminan Rp0; batas dan kebijakan dapat berubah. Pantau pemakaian dan siapkan fallback manual.

Dokumentasi acuan:
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare D1 pricing: https://developers.cloudflare.com/d1/platform/pricing/
- Cloudflare Cron Triggers: https://developers.cloudflare.com/workers/configuration/cron-triggers/
- Web Push event/Service Worker: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/push_event
- Gemini API pricing dan kebijakan tier: https://ai.google.dev/gemini-api/docs/pricing
- Katalog model Gemini API: https://ai.google.dev/gemini-api/docs/models
- Ketentuan tambahan Gemini API (termasuk batasan usia, jenis penggunaan, dan penggunaan data pada layanan tanpa biaya): https://ai.google.dev/gemini-api/terms

## 10. Kebutuhan Fungsional

Prioritas: **Must** wajib MVP; **Should** penting jika waktu memungkinkan; **Could** tambahan; **Won't (MVP)** tidak dikerjakan di versi pertama.

| ID | Kebutuhan | Prioritas | Kriteria penerimaan |
|---|---|---|---|
| FR-01 | Membuat kegiatan manual | Must | Kegiatan dengan judul dan tanggal valid dapat disimpan |
| FR-02 | Melihat dan mengedit detail kegiatan | Must | Perubahan tampil di kalender dan agenda setelah disimpan |
| FR-03 | Menandai selesai atau dibatalkan | Must | Status berubah dan semua pengingat berhenti |
| FR-04 | Menghapus kegiatan atas tindakan pengguna | Must | Terhapus setelah konfirmasi; tidak ada penghapusan otomatis |
| FR-05 | Kalender bulanan | Must | Kegiatan tampil pada tanggal yang benar |
| FR-06 | Tampilan mingguan dan harian | Should | Pengguna dapat berpindah mode dan periode |
| FR-07 | Dashboard agenda | Must | Menampilkan tanggal saat ini dan kegiatan terdekat |
| FR-08 | Unggah poster/foto dan pemrosesan otomatis | Must | Setelah provider lolos gerbang ketentuan, berkas valid dari formulir langsung diproses tanpa tombol/mode AI terpisah; jika provider eksternal belum layak, gunakan fallback OCR lokal yang telah diuji atau formulir manual; berkas tidak valid ditolak dengan pesan jelas |
| FR-09 | Ekstraksi poster menjadi draf | Must | Draf terisi otomatis dari provider yang disetujui atau OCR lokal yang lulus uji; tidak disimpan otomatis; field tidak diketahui ditandai kosong/perlu diperiksa |
| FR-09b | Kandidat tanggal berlabel dan kegiatan terpisah dari poster | Should | Poster dengan banyak tanggal menampilkan daftar kandidat berlabel; pengguna dapat mengganti tanggal utama dan menambahkan tanggal lain sebagai kegiatan terpisah |
| FR-10 | Mengoreksi draf AI | Must | Pengguna dapat mengubah semua informasi sebelum penyimpanan |
| FR-11 | Mengaktifkan pengingat per kegiatan | Must | Pengguna dapat mengaktifkan/mematikan pengingat, memilih jenis (harian; sebelum mulai bila FR-12b dibangun), jam, dan jendela hari |
| FR-12 | Pengingat harian dalam jendela hari | Must | Maksimal satu notifikasi per hari, hanya dalam jendela yang dipilih, hingga hari kegiatan (jika waktu belum lewat), selama izin dan layanan mendukung |
| FR-12b | Pengingat sebelum mulai | Should (dibangun setelah FR-12 stabil) | Untuk kegiatan berjam, notifikasi dikirim sekali pada (mulai − offset) bila belum lewat |
| FR-13 | Stop notifikasi setelah kegiatan lewat | Must | Tidak ada pengingat baru setelah waktu kegiatan lewat; kegiatan tetap di riwayat |
| FR-14 | Riwayat kegiatan | Must | Kegiatan selesai/terlewat dapat dilihat tanpa dihapus otomatis |
| FR-15 | Akses Tanpa Akun | Must | Fitur utama dapat dipakai tanpa daftar/login/email/password/nomor HP/OTP/SMS (lihat Bagian 3) |
| FR-16 | Nama tampilan opsional | Should | Dapat diisi, diubah, atau dikosongkan |
| FR-17 | Tema System/Light/Dark | Must | Dipilih di Pengaturan dan tersimpan pada perangkat |
| FR-18 | PWA responsif | Must | Tata letak dapat dipakai di HP dan desktop modern |
| FR-19 | Ekspor/impor data (JSON) | **Must** | Ekspor menghasilkan berkas JSON ber-versi skema; impor memvalidasi, menggabungkan tanpa duplikasi, dan menjadwal ulang pengingat; berkas rusak/versi tidak dikenal ditolak dengan pesan jelas |
| FR-20 | Voice Note (tekan-tahan ±0,8 dtk + tombol mikrofon) | Should — **MVP kondisional** | Dirilis jika lolos kriteria kelayakan di bawah; tap membuka teks; tekan-tahan masuk mode suara; Stop/Batal; transkripsi dapat diedit; jika tidak didukung, input teks tetap tersedia |
| FR-21 | Sinkronisasi lintas perangkat | Won't (MVP) | Tidak ada klaim sinkronisasi otomatis |
| FR-22 | WhatsApp/SMS reminder | Won't (MVP) | Tidak ada integrasi pesan atau biaya provider |
| FR-23 | Hapus semua data saya | Must | Menghapus kegiatan/pengaturan lokal segera setelah konfirmasi dan meminta penghapusan kegiatan, push subscription, serta identitas instalasi di backend; jika offline, hanya penanda minimum untuk menyelesaikan penghapusan dipertahankan sementara, data acara lokal dibersihkan, dan status penghapusan server tertunda ditampilkan sampai dikonfirmasi atau ditangani prosedur retensi |
| FR-24 | Perlindungan penyalahgunaan endpoint AI | Must | Rate limit per instalasi dan batas global harian aktif; Turnstile pada unggahan; saat batas tercapai pengguna diarahkan ke input manual |
| FR-25 | Aplikasi dan data tersedia offline (baca) dan ekspor offline | Must | Setelah kunjungan pertama, aplikasi terbuka tanpa internet; kalender, agenda, dan riwayat menampilkan data yang tersimpan lokal; ekspor data dapat dilakukan offline |
| FR-26 | Tambah, edit, selesai, batal, dan hapus kegiatan secara offline | Must hanya jika gerbang Spike lolos; jika tidak, ditunda ke fase lanjutan | Operasi berhasil tanpa internet, langsung terlihat di UI, dan masuk antrean; jika gerbang tidak lolos, seluruh aksi yang mengubah data dinonaktifkan saat offline dengan pesan jelas dan MVP berstatus offline baca-saja |
| FR-27 | Sinkronisasi otomatis dan idempoten | Must | Antrean terkirim otomatis saat online; pengiriman ulang tidak menggandakan kegiatan; kegagalan tidak menghilangkan data lokal dan dapat dicoba ulang |
| FR-28 | Indikator koneksi/sinkron dan perilaku fitur online-only | Must | Status Offline/Menunggu sinkron/Tersinkron/Gagal sinkron terlihat; unggah poster dan Voice Note online dinonaktifkan dengan pesan jelas saat offline; bila penulisan offline belum didukung, semua aksi ubah data dinonaktifkan dan mode baca-saja dijelaskan; kegiatan belum tersinkron diberi tanda terkait pengingat |
| FR-29 | Penyimpanan persisten dan pengingat cadangan | Should | Aplikasi meminta penyimpanan persisten; Pengaturan mengingatkan ekspor berkala; pengguna diberi tahu bila data lokal tidak tersedia |
| FR-30 | Pemberitahuan privasi saat mengaktifkan pengingat | Must | Saat pengguna pertama kali mengaktifkan pengingat, tampil penjelasan singkat bahwa salinan kegiatan dan identitas instalasi disimpan di server agar pengingat dapat dikirim, dengan tautan Kebijakan Privasi dan pilihan tidak mengaktifkan pengingat |
| FR-31 | Masa simpan salinan server | Should | Salinan server dari instalasi tanpa aktivitas melewati batas masa simpan (usulan 180 hari) dihapus otomatis hanya bila tidak ada pengingat aktif/mendatang yang masih perlu diproses; data yang masih dibutuhkan untuk pengingat aktif dipertahankan sampai pengingat tidak lagi diperlukan, lalu mengikuti kebijakan retensi yang diumumkan; push subscription tidak valid dibersihkan |
| FR-32 | Pemberitahuan pemrosesan poster oleh provider AI eksternal | Must jika provider eksternal digunakan | Sebelum gambar pertama kali dikirim, pengguna diberi tahu bahwa gambar diproses provider eksternal, ringkasan penggunaan data, dan pilihan lanjut/batal; jika batal, tidak ada gambar yang dikirim dan pengguna dapat memakai OCR lokal/manual bila tersedia |

**Kriteria kelayakan Voice Note (usulan):** berfungsi pada browser sasaran (misalnya Chrome Android dan Chrome desktop; Safari iOS dicatat dukungannya apa adanya); bahasa `id-ID`; pada 20 ucapan uji, judul dan tanggal terbaca benar pada ≥ 80% kasus; pemrosesan audio sudah dapat dijelaskan di antarmuka; fallback teks tidak terganggu. Jika tidak lolos, FR-20 ditunda ke fase lanjutan tanpa memengaruhi kriteria penerimaan MVP.

## 11. Aturan Bisnis Pengingat dan Status

1. Pengingat opsional per kegiatan; aktif setelah pengguna mengaturnya.
2. **Pengingat harian:** jam dapat diubah (jam awal prototipe 08.00 Asia/Jakarta, divalidasi saat pengujian). Jendela hari dipilih pengguna: 3, 7 (default), 14 hari terakhir, atau sejak dibuat.
3. Pengingat harian hanya dikirim ketika kegiatan masih akan datang dan hari ini berada dalam jendela. Maksimal satu per kegiatan per tanggal lokal.
4. Pada hari kegiatan berjam, pengingat harian dilewati jika jam mulai sudah lewat. Untuk kegiatan tanggal saja, tanggal tersebut adalah hari pengingat terakhir.
5. **Pengingat sebelum mulai** *(Should, FR-12b)*: hanya untuk kegiatan berjam; dikirim sekali pada (mulai − offset: 30 menit, 1 jam, atau 1 hari). Dilewati jika waktunya sudah lewat saat kegiatan dibuat/diubah.
6. Pengingat harian dan sebelum mulai berdiri sendiri; pengguna boleh memakai keduanya, sehingga satu kegiatan dapat menerima satu notifikasi harian ditambah satu notifikasi sebelum mulai pada hari yang sama.
7. Status tampilan **diturunkan dari waktu**, bukan diubah oleh Cron: Akan Datang, Sedang Berlangsung, Terlewat (waktu/akhir tanggal lewat dan pengguna belum menandai Selesai/Dibatalkan). Yang disimpan hanya pilihan pengguna: `active`, `completed`, `cancelled`.
8. **Selesai** atau **Dibatalkan** menghentikan semua pengingat segera.
9. Perubahan tanggal, waktu, atau pengaturan pengingat memperbarui penjadwalan dan mereset penanda pengiriman yang relevan.
10. Jika browser tidak mendukung push, izin ditolak, perangkat offline, atau layanan push gagal, tampilkan status yang jujur; jangan tampil seolah notifikasi pasti terkirim.
11. Catat `last_reminded_local_date` dan `pre_start_sent_at` agar Cron tidak mengirim ganda.
12. Kegiatan Terlewat/Selesai tetap di Riwayat sampai pengguna menghapusnya.
13. Jadwal berbenturan boleh ditandai tetapi tidak dicegah.
14. **Pengingat dijadwalkan di server.** Kegiatan yang dibuat atau diubah offline berstatus Menunggu sinkron; pengingatnya baru dijadwalkan atau diperbarui setelah tersinkron. UI menandai kegiatan tersebut.
15. Jika kegiatan diselesaikan, dibatalkan, atau dihapus saat offline, notifikasi lama dari server masih dapat terkirim sampai sinkronisasi terjadi. Dampaknya diminimalkan dengan sinkronisasi segera saat koneksi kembali; apakah Service Worker dapat menahan notifikasi berdasarkan status lokal (browser umumnya mewajibkan push menampilkan notifikasi) diverifikasi pada Spike Teknis.
16. **Penyelesaian konflik:** perubahan dengan `revision` lebih tinggi menang (last-write-wins per kegiatan); tidak ada penggabungan antar-field. `revision` naik setiap perubahan lokal, tidak bergantung pada jam perangkat. Ini cukup karena satu instalasi dipakai pada satu perangkat; impor menggabungkan berdasarkan `id` dan `revision`.
17. Penghapusan memakai tombstone sampai server mengonfirmasi, lalu dapat dibersihkan.

## 12. Data Utama dan Model Data Awal

### Installation (identitas instalasi)
- `installation_id`: identifier acak internal.
- `installation_token_hash`: hash token rahasia instalasi.
- `display_name`: opsional; bukan identitas login.
- `timezone`: default `Asia/Jakarta`.
- `last_seen_at`: terakhir aktif/sinkron; dipakai untuk masa simpan salinan server.
- `theme_preference`: `system`, `light`, `dark`.
- `created_at`, `updated_at`.

Ini bukan akun pengguna (lihat Bagian 3).

### Event
- `id` (UUID dibuat di klien), `installation_id`.
- `title` (wajib), `description`.
- `start_date`, `start_time` (boleh kosong), `end_date`, `end_time`, `is_all_day`.
- `location`, `category`.
- `user_status`: `active`, `completed`, `cancelled` (status tampilan diturunkan; lihat Bagian 11).
- `source_type`: `manual`, `voice`, `poster`. Simpan hasil transkripsi sebagai judul/deskripsi; audio mentah tidak disimpan.
- `date_label` (opsional): `acara`, `pendaftaran`, `tenggat`, `lainnya`.
- `daily_reminder_enabled`, `daily_reminder_time`, `daily_window_days`, `last_reminded_local_date`.
- `next_reminder_at` (UTC, terindeks): waktu pengingat berikutnya yang dihitung server; null bila tidak ada. Cron hanya mengambil baris yang jatuh tempo dengan `LIMIT`, sisanya diproses pada tick berikutnya.
- `pre_start_offset_minutes` (nullable), `pre_start_sent_at`.
- `revision` (bilangan bulat naik tiap perubahan), `deleted_at` (tombstone, nullable).
- `sync_state` (hanya lokal): `synced`, `pending`, `failed`.
- `created_at`, `updated_at`.

### Push Subscription
- `id`, `installation_id`, `subscription_endpoint`, dan key yang dibutuhkan Web Push.
- Metadata perangkat seminimal mungkin.
- `created_at`, `updated_at`, `last_success_at`.
- Nonaktifkan/hapus subscription yang tidak valid.

### Penyimpanan lokal dan antrean (di perangkat)
*Rancangan data tetap local-first. Antrean perubahan untuk penulisan saat offline hanya diaktifkan jika gerbang Spike lolos.*
- Tabel kegiatan lokal (sumber data utama UI) dan pengaturan.
- **Antrean perubahan:** `op_id` (UUID), `event_id`, `op_type` (`upsert`, `delete`), `payload`, `created_at`, `attempts`, `last_error`.
- Antrean diproses berurutan per kegiatan; operasi berhasil dihapus dari antrean setelah dikonfirmasi server.

### Extraction Draft (sementara)
- Judul, lokasi, dan **daftar kandidat tanggal/waktu** masing-masing dengan `label` dan `confidence`/penanda ambigu.
- Status pemeriksaan dan pesan error.
- Tidak dipertahankan setelah kegiatan disimpan atau draf dibuang.

### Format berkas ekspor (JSON)
```json
{
  "app": "CatatKu",
  "schema_version": 1,
  "exported_at": "YYYY-MM-DDTHH:mm:ss+07:00",
  "settings": {
    "display_name": null,
    "timezone": "Asia/Jakarta",
    "theme_preference": "system"
  },
  "events": [
    {
      "id": "event-uuid",
      "title": "Contoh kegiatan",
      "description": "Catatan opsional",
      "start_date": "YYYY-MM-DD",
      "start_time": "09:00",
      "end_date": null,
      "end_time": null,
      "is_all_day": false,
      "location": null,
      "category": null,
      "user_status": "active",
      "source_type": "manual",
      "date_label": "acara",
      "daily_reminder_enabled": true,
      "daily_reminder_time": "08:00",
      "daily_window_days": 7,
      "pre_start_offset_minutes": null
    }
  ]
}
```
Contoh ini menunjukkan field utama, bukan data pengguna nyata. Berkas ekspor harus menyertakan seluruh field kegiatan dan pengaturan yang diperlukan untuk memulihkan kalender serta preferensi pengingat. Field internal yang tidak perlu dipindahkan (`installation_id`, hash/token instalasi, push subscription, `next_reminder_at`, `sync_state`, tombstone, dan penanda pengiriman server) tidak diekspor. Saat impor, server menghitung ulang penjadwalan; izin push harus diberikan pada instalasi baru. Impor memvalidasi skema, menggunakan `id` untuk mencegah duplikasi, dan menolak `schema_version` yang tidak dikenal.

Jangan menyimpan data yang tidak dibutuhkan. Batasi ukuran gambar, validasi tipe berkas, dan jelaskan bila gambar dikirim ke penyedia AI eksternal.

## 13. Kebutuhan Nonfungsional

- **Usability:** alur menambah kegiatan jelas bagi pengguna baru; gestur tekan-tahan memiliki petunjuk visual dan alternatif eksplisit.
- **Voice input:** izin mikrofon diminta saat dipakai; dapat dibatalkan; audio tidak disimpan permanen; pemrosesan oleh browser/layanan dijelaskan.
- **Responsive:** layar utama berfungsi di ponsel, tablet, dan desktop.
- **Performance (target usulan):** kalender utama interaktif ≤ 2 detik pada perangkat Android kelas menengah dengan jaringan 4G; poster → draf tampil ≤ 15 detik pada persentil ke-95 untuk gambar yang sudah diperkecil; interaksi UI umum terasa responsif (< 200 ms).
- **Accessibility:** kontras memadai, tidak bergantung hanya pada warna, fokus keyboard terlihat, label kontrol jelas, tombol bernama jelas, Voice Note dapat dicapai tanpa gestur tekan-tahan.
- **Reliability:** kegagalan AI tidak menghilangkan formulir manual; kegagalan notifikasi terlihat jelas.
- **Offline dan integritas data:** operasi lokal tidak boleh hilang saat aplikasi ditutup, sinyal putus, atau sinkron gagal; sinkronisasi idempoten; tombstone mencegah kegiatan terhapus "hidup kembali"; status sinkron selalu terlihat. Data lokal dapat dihapus browser, sehingga ekspor berkala didorong. Ketentuan antrean dan sinkron untuk penulisan offline berlaku bila gerbang Spike lolos.
- **Privacy:** Akses Tanpa Akun; jelaskan data yang tersimpan di backend, pemrosesan gambar/suara oleh pihak ketiga, dan sediakan halaman Kebijakan Privasi singkat serta fitur Hapus semua data.
- **Security:** token tidak mudah ditebak; validasi semua masukan; batasi ukuran/jenis berkas; rahasia hanya di backend; periksa kepemilikan data pada setiap API; rate limit dan Turnstile pada endpoint AI.
- **Data retention:** salinan kegiatan utama lokal tidak dihapus otomatis; pengguna dapat menghapus dan mengekspor data. Retensi salinan server mengikuti FR-31 dan tidak boleh menghapus data yang masih diperlukan untuk pengingat aktif.
- **Free-tier resilience:** input manual tetap tersedia jika kuota AI habis.
- **Time handling:** semua logika pengingat memakai zona waktu yang jelas; konversi UTC Cron diuji pada batas tanggal.
- **Notification limits:** Web Push bergantung pada izin, HTTPS, Service Worker, kompatibilitas perangkat, dan layanan push. Notifikasi saat aplikasi tertutup diuji di perangkat target (termasuk iOS dengan PWA terpasang).

## 14. Privasi, Keamanan, dan Open Source

- Source code dapat dipublikasikan di repositori publik dengan lisensi open-source yang disepakati (misalnya MIT). Kode terbuka tidak berarti data pengguna terbuka.
- Jangan mengunggah `.env`, token, kunci VAPID, atau API key ke repositori.
- Identitas instalasi adalah identifier teknis otomatis; bukan akun, tetapi juga bukan anonimitas absolut terhadap infrastruktur hosting.
- Data jadwal bersifat pribadi: batasi akses berdasarkan identitas instalasi dan jangan izinkan akses hanya dengan mengetahui ID kegiatan.
- Jelaskan keterbatasan pemulihan dan arahkan pengguna membuat cadangan ekspor secara berkala (mis. pengingat lembut di Pengaturan).
- Dengan local-first, salinan data berada di perangkat dan di server. Jika browser menghapus data situs, salinan lokal dan cookie identitas hilang, sedangkan salinan server tidak dapat diakses lagi tanpa identitas tersebut; jelaskan hal ini di Kebijakan Privasi dan pada fitur Hapus semua data.
- **Pemberitahuan saat mengaktifkan pengingat** (FR-30) dan **masa simpan salinan server** (FR-31) dijelaskan di Kebijakan Privasi. Usulan 180 hari tidak boleh menghapus data server yang masih diperlukan untuk menjadwalkan pengingat aktif/mendatang. Hapus semua data (FR-23) membersihkan data lokal segera dan menyelesaikan penghapusan server saat online; jika offline, UI harus menyatakan dengan jelas bahwa penghapusan server masih tertunda.
- **Opsi minimisasi (dievaluasi pada Spike):** hanya kegiatan yang memiliki pengingat yang dicerminkan ke server; kegiatan tanpa pengingat tetap sepenuhnya lokal. Opsi ini mengurangi data di server dan beban D1, tetapi menambah aturan sinkron saat pengingat diaktifkan atau dimatikan.
- **Gerbang penggunaan Gemini API:** ketentuan tambahan resmi yang berlaku sejak 23 Maret 2026 menyatakan API untuk penggunaan profesional/bisnis, bukan konsumen, mewajibkan pengguna API berusia ≥18 tahun, dan melarang API Client yang ditujukan kepada atau kemungkinan diakses individu di bawah 18 tahun. Karena CatatKu ditujukan kepada masyarakat umum sebagai aplikasi pribadi, kesesuaian Gemini untuk produksi publik belum dapat diasumsikan. Sebelum dipublikasikan dengan Gemini, lakukan pemeriksaan ketentuan saat itu; jika tidak sesuai atau tidak jelas, jangan aktifkan Gemini pada produksi publik dan gunakan OCR lokal atau provider yang persyaratannya sesuai.
- Data dari layanan Gemini tanpa biaya dapat digunakan untuk meningkatkan produk Google dan dapat ditinjau manusia menurut ketentuan resmi saat revisi ini dibuat. Jangan kirim data sensitif, rahasia, atau pribadi; berikan pemberitahuan sebelum poster dikirim ke provider eksternal. Verifikasi ulang halaman resmi sebelum rilis.
- Open-source tidak otomatis berarti hosting, database, atau AI selalu gratis.

## 15. Metrik Keberhasilan

Diukur melalui pengujian prototipe. **Target berikut adalah usulan awal** dan ditetapkan ulang setelah baseline Tahap 2.

**Kegunaan**
- ≥ 80% peserta uji dapat membuat dan mengedit kegiatan tanpa bantuan.
- Skor SUS ≥ 68 pada pengujian kegunaan (minimal 8 peserta).
- Waktu median poster → kegiatan tersimpan ≤ 60 detik, dan lebih cepat daripada baseline input manual yang diukur pada peserta yang sama.

**Kualitas AI** (pada set uji ≥ 30 poster berbahasa Indonesia, beragam kualitas)
- Tanggal acara benar pada ≥ 80% poster; judul benar pada ≥ 85%.
- Kesalahan tanggal/waktu yang tidak ditandai sebagai ambigu (kesalahan senyap) dicatat dan ditargetkan < 5%.

**Pengingat**
- ≥ 95% notifikasi terkirim dan tampil pada perangkat/browser yang dinyatakan didukung selama uji 7 hari.
- 0 notifikasi setelah kegiatan Selesai/Dibatalkan/Terlewat **berdasarkan status yang sudah tercatat di server**, dan 0 notifikasi harian ganda pada satu tanggal. Notifikasi yang terkirim karena perubahan belum tersinkron (pengguna sedang offline) dicatat sebagai **keterbatasan yang diketahui**, bukan kegagalan.

**Fungsional lain**
- Kegiatan tampil pada tanggal dan waktu yang benar; kegiatan Terlewat tetap di Riwayat.
- Ekspor lalu impor di instalasi baru memulihkan 100% kegiatan uji tanpa duplikasi.
- **Offline baca (wajib):** aplikasi terbuka dan menampilkan kegiatan tanpa internet pada ≥ 95% percobaan uji setelah kunjungan pertama.
- **Offline tambah/edit (hanya jika gerbang Spike lolos):** 100% operasi tambah/edit/selesai/hapus yang dilakukan offline tersinkron setelah online tanpa kehilangan atau duplikasi pada skenario uji; sinkronisasi ≤ 50 perubahan selesai ≤ 10 detik setelah koneksi kembali (usulan).
- Tema dan layout berfungsi di mobile dan desktop.

## 16. Rencana Pengujian dan Kriteria Penerimaan MVP

### Pengujian fungsional
- CRUD kegiatan; kegiatan berjam, tanggal saja, dan sepanjang hari.
- Poster jelas, buram, tanpa tanggal, tanpa tahun, dan banyak tanggal (pendaftaran, acara, tenggat); verifikasi pemilihan tanggal utama dan pembuatan kegiatan terpisah.
- Hasil AI selalu berupa draf yang dapat dikoreksi.
- Kegiatan tampil pada tanggal kalender yang benar.
- Pengingat harian pada beberapa hari berturut-turut: maksimal satu per hari, hanya dalam jendela hari.
- *(Jika FR-12b dibangun)* Pengingat sebelum mulai: terkirim sekali; dilewati bila sudah lewat.
- Hari kegiatan: kirim hanya jika belum lewat.
- Pengingat berhenti setelah Selesai, Dibatalkan, atau Terlewat; Terlewat tetap di Riwayat.
- Perubahan tanggal/jam menjadwalkan ulang pengingat.
- Batas tanggal akibat UTC vs Asia/Jakarta (mis. pengingat sekitar tengah malam).
- Izin notifikasi ditolak/diterima, browser tanpa push, offline, subscription tidak valid.
- Tema System/Light/Dark dan layout responsif.
- Satu instalasi tidak dapat membaca kegiatan instalasi lain.
- Cookie identitas bekerja pada deployment satu origin; uji Safari, Chrome, dan PWA terpasang (termasuk iOS: apakah data/izin berbeda antara Safari dan Home Screen).
- Ekspor → impor pada instalasi baru; berkas rusak; versi skema tidak dikenal; impor ganda tidak menduplikasi.
- Hapus semua data menghapus data backend.
- **Offline:** buka aplikasi dalam mode pesawat setelah kunjungan pertama dan lihat kalender/agenda/riwayat (wajib); *jika gerbang Spike lolos:* tambah/edit/selesai/hapus offline lalu online (data sama di server, tanpa duplikasi); sinkron terputus di tengah jalan lalu dilanjutkan; kirim ulang operasi yang sama (idempoten); banyak perubahan beruntun pada kegiatan yang sama (revisi); hapus offline lalu online (tombstone); indikator dan tanda Menunggu sinkron benar; unggah poster/Voice Note dinonaktifkan saat offline; ekspor offline; pembukaan pertama tanpa internet; pembaruan Service Worker saat antrean belum kosong; penyimpanan persisten ditolak/diterima.
- Rate limit dan batas global endpoint AI; perilaku saat kuota AI habis.
- **Jika Voice Note dirilis:** tap vs tekan-tahan; melepas tombol setelah mode aktif; Stop/Batal; edit transkripsi; izin mikrofon ditolak; transkripsi kosong/salah; browser tidak didukung; fallback teks; long-press tidak memunculkan menu konteks.

### Kriteria penerimaan
MVP siap didemonstrasikan apabila pengguna dapat:
1. Membuka aplikasi tanpa login dan tanpa nomor HP.
2. Menambah kegiatan manual.
3. Mengunggah poster dan otomatis memperoleh draf yang dapat diedit tanpa memilih mode AI.
4. Menyimpan kegiatan dan melihatnya di kalender.
5. Mengaktifkan pengingat harian (dan sebelum mulai jika FR-12b dibangun) dan melihat perilaku berhenti sesuai aturan.
6. Menemukan kegiatan selesai/terlewat di Riwayat.
7. Mengekspor lalu mengimpor data pada instalasi lain.
8. Memakai tema System, Light, Dark.
9. Memakai antarmuka utama di layar mobile dan desktop.
10. Memakai input manual ketika AI atau notifikasi tidak tersedia.
11. Membuka aplikasi dan melihat kalender, agenda, serta riwayat tanpa internet (wajib).
12. *Hanya jika gerbang Spike offline lolos:* menambah dan mengedit kegiatan tanpa internet, lalu melihat perubahan tersinkron otomatis saat online. Jika gerbang tidak lolos, butir ini tidak menjadi syarat penerimaan.

Voice Note **tidak** menjadi syarat penerimaan; jika lolos kelayakan, ia diuji dan didemonstrasikan sebagai tambahan.

## 17. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| AI salah membaca tanggal/jam | Jadwal salah | Draf wajib konfirmasi; tandai ambigu; kandidat tanggal berlabel |
| Poster memuat banyak tanggal | Tanggal yang dipakai keliru | Label jenis tanggal; pemilih tanggal utama; opsi kegiatan terpisah |
| Voice Note tidak konsisten antar-browser atau audio diproses pihak ketiga | Gagal atau risiko privasi | Uji kelayakan; jelaskan pemrosesan; tombol mikrofon berlabel; fallback teks; kondisional untuk MVP |
| Notifikasi tidak diizinkan/didukung | Pengingat tidak sampai | Minta izin dengan penjelasan; uji browser target; tampilkan status jujur |
| Pengingat harian terasa spam | Pengguna mematikan notifikasi | Jendela hari default 7; pengingat sebelum mulai; evaluasi di wawancara |
| Cron berjalan dalam UTC | Pengingat bergeser | Konversi zona waktu; uji batas tanggal |
| Cookie diblokir karena API lintas-situs | Identitas instalasi gagal | API satu origin dengan frontend; uji lintas browser |
| iOS: PWA terpasang memiliki penyimpanan terpisah dari Safari; push hanya untuk PWA terpasang (verifikasi pada perangkat uji) | Data/izin "hilang" saat instal; pengingat tidak muncul | Panduan pasang di awal; ekspor/impor; uji di perangkat iOS |
| Identitas instalasi/cookie hilang | Data tidak dapat diakses | Jelaskan sejak awal; ekspor/impor (Must); pengingat cadangan berkala |
| Token disalahgunakan | Data terekspos | Token kuat, cookie aman, cek kepemilikan di API, rate limit |
| Endpoint AI disalahgunakan menghabiskan kuota | AI tidak tersedia bagi semua | Rate limit per instalasi, batas global, Turnstile, fallback manual |
| Kuota gratis habis/berubah | Layanan terbatas | Pantau pemakaian, batasi unggahan, input manual, tinjau kuota sebelum publikasi |
| Ketentuan AI terkait data | Risiko privasi | Kirim data seperlunya, beri pemberitahuan, evaluasi alternatif |
| Ketentuan Gemini API tidak sesuai untuk aplikasi konsumen/masyarakat umum atau sasaran pengguna | Penggunaan produksi tidak diizinkan/berisiko tidak patuh | Gerbang ketentuan provider sebelum produksi; jangan aktifkan Gemini jika tidak sesuai; pilih OCR lokal atau provider lain yang sesuai |
| Library Web Push tidak kompatibel dengan Workers | Notifikasi tidak bisa dikirim | Spike Teknis lebih awal; siapkan opsi library/implementasi alternatif |
| Diferensiasi lemah dibanding Google Calendar | Pengguna tidak berpindah | Validasi di wawancara; fokus pada alur poster → draf dan pengingat tidak spam |
| Batas Workers Free (CPU 10 ms dan 50 subrequest per pemanggilan Cron) tidak cukup untuk lonjakan pengingat | Pengingat terlambat atau terlewat; target biaya Rp0 tidak tercapai | Spike Pengingat sebelum membangun fitur lain; `next_reminder_at` + batching; Queues; sebar jam; siapkan opsi paket berbayar kecil |
| Browser menghapus data lokal (penyimpanan tidak persisten, mode privat, pembersihan sistem) | Kegiatan offline yang belum tersinkron hilang | Minta penyimpanan persisten; sinkron sesering mungkin; ekspor berkala; peringatan di Pengaturan |
| Job retensi menghapus salinan server yang masih dibutuhkan untuk pengingat mendatang | Pengingat terlewat | Retensi tidak menghapus baris yang memiliki pengingat aktif/mendatang; uji job dengan skenario acara masa depan |
| Sinkronisasi gagal, ganda, atau saling menimpa | Data hilang atau duplikat | Operasi idempoten (`op_id`), nomor revisi, tombstone, skenario uji khusus |
| Pengingat basi atau belum terjadwal untuk perubahan offline | Pengguna salah mengira sudah diingatkan | Tanda Menunggu sinkron, sinkron segera saat online, penjelasan jujur di UI; verifikasi opsi menahan notifikasi pada Spike |
| Background Sync tidak merata di browser (terutama iOS) | Sinkron tertunda sampai aplikasi dibuka | Tidak mengandalkannya; pemicu saat aplikasi dibuka, event koneksi, dan tombol manual |
| Kompleksitas offline membengkak | MVP terlambat | Arsitektur local-first sejak E1; gerbang Spike dengan jalur turun ke offline baca-saja; kasus sulit ditunda |
| Catatan wawancara berisi data pribadi ikut ter-commit ke repo publik | Pelanggaran privasi narasumber | Anonimkan narasumber (P1, P2); simpan catatan mentah hanya di vault pribadi di luar repo (21.6) |
| Lingkup terlalu besar | MVP terlambat | Prioritaskan kalender, input manual, poster, pengingat, ekspor/impor; Voice Note kondisional |

## 18. Tahapan Pengerjaan

### Tahap 1 — Validasi kebutuhan
- Pilih kelompok calon pengguna; observasi/wawancara (termasuk pertanyaan alternatif yang dipakai saat ini).
- Catat proses nyata dan masalah yang ditemukan.
- Validasi preferensi pengingat (harian vs sebelum mulai) dan penerimaan tanpa login.
- Perbarui Bagian 2 dan 2.1 dengan temuan.

### Tahap 2 — UI/UX dan prototipe
- Wireframe dashboard kalender, formulir, alur poster (termasuk pemilih tanggal), detail, riwayat, pengaturan, ekspor/impor.
- Implementasikan tema dan responsivitas; uji tugas dasar dengan calon pengguna; ukur baseline metrik.

### Tahap 2B — Spike teknis (dijadwalkan tepat sebelum milestone yang bergantung padanya)

**Penjadwalan (just-in-time):**
- Selama M2: uji persistensi IndexedDB dan `navigator.storage.persist()`, termasuk iOS PWA terpasang.
- Setelah M2, sebelum M3: **Spike Pengingat** (gerbang integrasi), verifikasi Worker + Static Assets menjalankan `scheduled`, cookie identitas satu origin, dan **gerbang offline tambah/edit** (antrean sinkron idempoten).
- Sebelum M4: pemeriksaan ketentuan dan kelayakan provider AI, lalu akurasi ekstraksi kandidat pada ≥ 30 poster berbahasa Indonesia. Gemini bukan pilihan otomatis; ketentuan provider harus cocok dengan aplikasi konsumen publik terlebih dahulu.
- Sebelum M5 (atau lebih awal bila waktu ada): kelayakan Voice Note (`id-ID`) dan uji lintas perangkat lanjutan.

**Isi spike:**
- **Spike Pengingat (dikerjakan setelah M2 dan sebelum M3; gerbang integrasi pengingat):** buat prototipe kecil berupa Worker dengan Cron yang membaca jadwal dari D1 dan mengirim Web Push pada waktu yang benar ke perangkat uji, tanpa aplikasi dibuka. Uji dengan data contoh (mis. 100 dan 1.000 kegiatan, termasuk lonjakan banyak pengingat pada jam yang sama). Ukur CPU time, jumlah subrequest, kegagalan push, dan ketepatan waktu. Bila batas Workers Free tidak cukup, opsi: Cron lebih sering dengan batch kecil (`next_reminder_at` + `LIMIT`), antrean (mis. Cloudflare Queues), menyebar jam pengingat, atau paket berbayar kecil. Keputusan biaya dicatat sebagai ADR. Integrasi pengingat ke aplikasi utama baru dimulai setelah spike ini lulus.
- Kirim Web Push dari Workers (library, VAPID) ke Chrome Android, Chrome desktop, dan iOS PWA terpasang.
- Pastikan cookie identitas berfungsi dengan deployment satu origin.
- Uji perilaku penyimpanan/izin iOS antara Safari dan Home Screen.
- Hermes memeriksa katalog model dan ketentuan resmi provider. Jika Gemini API lolos gerbang kelayakan, uji kandidat yang tersedia untuk API key pada ≥ 30 poster; ukur akurasi judul/tanggal/waktu/lokasi, beda tanggal acara vs pendaftaran/tenggat, latensi, kegagalan, dan kuota. Jika Gemini tidak memenuhi ketentuan untuk produksi publik, jangan gunakan di produksi; uji OCR lokal atau provider lain yang sesuai. Catat model/provider terpilih dan alasan dalam ADR tanpa mengarang hasil yang belum diuji.
- Uji Web Speech `id-ID` pada browser sasaran dan putuskan apakah Voice Note masuk MVP.
- **Gerbang offline:** uji IndexedDB, antrean sinkron, API sinkron idempoten, dan `navigator.storage.persist()` di Chrome Android, Chrome desktop, dan iOS PWA terpasang. Jika lolos, tambah/edit offline masuk MVP (FR-26 Must). Jika gagal atau waktu mepet, turun ke offline baca-saja tanpa mengubah arsitektur local-first. Verifikasi juga opsi menahan notifikasi basi berdasarkan status lokal.
- Verifikasi bahwa satu Worker dengan Static Assets dapat menjalankan handler `scheduled` (bagian dari Spike Pengingat); Pages + Worker Cron terpisah hanya fallback.
- Hasil spike memperbarui keputusan stack dan risiko, dicatat sebagai ADR (di `docs/`) dan diringkas di Dokumentasi CatatKu.

### Tahap 3 — MVP aplikasi
- Dikerjakan per milestone M1 sampai M5 (Bagian 21.7). Setiap milestone harus menghasilkan sesuatu yang dapat dijalankan dan diperiksa, bukan hanya kode yang selesai ditulis.
- Urutan: M1 fondasi, kalender, CRUD → M2 penyimpanan lokal, ekspor/impor, offline baca → **Spike Pengingat** → M3 backend, sinkronisasi, Web Push → M4 AI poster → M5 pengujian lintas perangkat, keamanan, Voice Note (jika lolos), rilis.
- PWA dan identitas instalasi otomatis.
- CRUD kegiatan dan kalender.
- Alur poster → OCR/AI otomatis → draf (kandidat tanggal) → konfirmasi.
- D1/Workers, aturan status dan pengingat harian lebih dulu, Web Push; pengingat sebelum mulai menyusul sebagai Should setelah pengingat harian stabil.
- Ekspor/impor dan Hapus semua data.
- Perlindungan endpoint AI.
- Voice Note jika lolos Spike.

### Tahap 4 — Pengujian dan presentasi
- Jalankan skenario uji dan dokumentasikan hasil terhadap metrik Bagian 15.
- Demo: input manual, poster hingga tampil di kalender, pengingat dan kondisi selesai/terlewat, ekspor/impor; Voice Note bila dirilis.
- Tuliskan keterbatasan: tanpa login, pemulihan data, kuota gratis, kompatibilitas notifikasi, perilaku iOS.

### Tahap 5 — Fitur lanjutan (setelah MVP stabil)
- Sinkronisasi lintas perangkat, jadwal berulang, integrasi kalender eksternal berdasarkan hasil penggunaan.

## 19. Asumsi dan Keputusan yang Sudah Ditetapkan

### Keputusan final untuk development (baseline v2.0)

| Bagian | Keputusan |
|---|---|
| Konsep | Aplikasi pengelola kegiatan pribadi berbantuan AI |
| Desain | Soft glassmorphism, kalender sebagai fokus utama |
| Tema | System, Light, Dark |
| Akun | Tidak ada login, nomor HP, atau verifikasi SMS |
| Penyimpanan | IndexedDB sebagai penyimpanan utama di perangkat (local-first) |
| Hosting/backend | Cloudflare Workers + Static Assets |
| Database server | Cloudflare D1, untuk sinkronisasi dan pengingat |
| AI poster | Membaca poster otomatis dan membuat draf yang dapat diperiksa pengguna; Hermes mengevaluasi kandidat model/provider, tetapi produksi hanya memakai provider yang ketentuannya sesuai dan telah diuji |
| Notifikasi | Web Push, setelah Spike Pengingat terbukti berjalan |
| Pengingat | Harian adalah prioritas MVP; sebelum mulai (FR-12b) berstatus Should |
| Offline | Baca wajib; tambah/edit offline hanya jika gerbang Spike lolos |
| Hapus semua data | Must (FR-23) |
| Voice Note | Kondisional; tidak boleh menghambat MVP |
| Biaya | Target Rp0 dalam batas layanan gratis, bukan janji gratis tanpa batas |
| Urutan kerja | M1 → M2 → Spike Pengingat → M3 → M4 → M5 |
| Lingkup | Dibekukan; tidak ada fitur baru sebelum MVP selesai (21.9) |

### Asumsi dan keputusan lain

- Nama CatatKu masih nama kerja.
- Target masyarakat umum; mahasiswa UISI sebagai sampel validasi awal.
- Akses Tanpa Akun (Bagian 3); identitas instalasi otomatis berbasis browser/perangkat; **pemulihan hanya lewat ekspor/impor**.
- Soft glassmorphism; kalender fokus utama; tema System/Light/Dark.
- **Pengingat: harian dalam jendela hari (default 7) adalah prioritas MVP; pengingat sebelum mulai berstatus Should; berhenti otomatis setelah kegiatan lewat atau ditandai selesai/dibatalkan.** *(Berubah dari v1.5)*
- Kegiatan lewat tetap di Riwayat dan tidak dihapus otomatis.
- Stack awal: React, Vite, TypeScript, Tailwind CSS, satu Cloudflare Worker dengan Static Assets, D1, Cron Triggers, Web Push, Turnstile.
- AI pembaca poster adalah fitur inti: unggahan valid langsung diekstraksi dan menjadi draf; pengguna wajib meninjau. Hermes mengevaluasi kandidat, tetapi provider produksi wajib lolos pemeriksaan ketentuan penggunaan, ketersediaan model/API, kuota, privasi, dan benchmark. Jika Gemini tidak sesuai untuk aplikasi konsumen publik, gunakan OCR lokal atau provider lain yang sesuai serta memiliki opsi gratis yang memadai; jika tidak ada, pertahankan input manual tanpa AI eksternal. Jangan mengaktifkan Gemini hanya karena API key tersedia.
- **Voice Note adalah MVP kondisional**, ditentukan lewat Spike Teknis. *(Disamakan dari v1.5)*
- **Arsitektur local-first dengan offline bertingkat:** data utama di perangkat, server sebagai cermin untuk pengingat; unggah poster dan Voice Note online-only; tambah/edit offline bergantung pada gerbang Spike Teknis, dengan jalur turun ke offline baca-saja. *(Baru di v1.8)*
- Target biaya Rp0 adalah sasaran prototipe dalam kuota gratis, bukan jaminan; jika Spike Pengingat menunjukkan batas gratis tidak cukup, keputusan biaya diambil secara eksplisit (ADR) sebelum pengembangan dilanjutkan.
- Seluruh angka target adalah usulan dan ditetapkan ulang setelah baseline.
- Latar belakang masalah dan diferensiasi diperbarui setelah data lapangan.

## 20. Ringkasan untuk Presentasi

**Nama:** CatatKu — pengelola kegiatan pribadi berbantuan AI.  
**Pengguna:** masyarakat umum; validasi awal dapat melibatkan mahasiswa UISI.  
**Solusi:** kalender kegiatan dengan input teks, AI pembaca poster menjadi draf jadwal, dan Voice Note (kondisional setelah uji kelayakan).  
**Diferensiasi (hipotesis):** poster → draf → konfirmasi dengan cepat, tanpa akun, pengingat yang tidak spam.  
**Fitur utama:** kalender, agenda terdekat, AI poster dengan pemilih tanggal, pengingat harian (sebelum mulai menyusul), status dan riwayat, ekspor/impor cadangan, tema System/Light/Dark, UI responsif.  
**Pengingat:** harian dalam jendela hari (sebelum mulai menyusul sebagai Should); berhenti setelah kegiatan lewat atau ditandai selesai/dibatalkan; kegiatan tetap di riwayat.  
**Offline:** local-first; lihat data tanpa internet (wajib), dan tambah/edit/selesai/hapus offline dengan sinkron otomatis bila Spike Teknis lolos; unggah poster (AI) dan pengiriman pengingat tetap butuh internet.  
**Privasi dan akses:** tanpa akun/login/email/nomor HP; identitas instalasi otomatis; pemulihan lewat ekspor/impor.  
**Teknologi:** React + Vite + TypeScript, Tailwind, Cloudflare Workers + Static Assets, D1, Cron Triggers, Web Push, Turnstile, GitHub (kode), Obsidian (dokumentasi tim), AI/OCR dipilih setelah pemeriksaan ketentuan provider dan pengujian; Gemini API tidak diaktifkan untuk produksi publik sebelum kesesuaiannya dipastikan.  
**Tujuan:** mengurangi kerja manual mencatat kegiatan dan membantu pengguna tidak melewatkan jadwal.

## 21. Alur Pengembangan, Deployment, dan Dokumentasi

Bagian ini bersifat operasional. Proyek dikerjakan dengan model product owner + coding agent (21.1). Obsidian, GitHub, dan Cloudflare adalah **alat kerja**, bukan fitur produk CatatKu.

### 21.1 Model kerja dan peran

| Peran | Tanggung jawab |
|---|---|
| Product owner dan reviewer (pemilik proyek) | Menentukan arah dan prioritas; menyetujui perubahan penting dan perubahan lingkup; menguji hasil di localhost sesuai PRD; memeriksa dokumentasi. Tidak wajib membaca setiap baris kode. |
| Coding agent (Hermes) | Mengimplementasikan satu tugas pada satu waktu sesuai PRD; menjalankan tes; memperbarui dokumentasi setelah tiap tugas selesai; melaporkan kendala dan meminta persetujuan untuk keputusan besar. |
| Reviewer dokumen/teknis (opsional) | Meninjau PRD, ADR, dan hasil spike (mis. asisten AI lain atau dosen). |

Jika proyek kelak melibatkan anggota lain, tambahkan peran sesuai kebutuhan.

### 21.2 Struktur repositori dan hosting

Satu repositori GitHub (monorepo) berisi kode dan dokumen proyek:

```
catatku/
├─ src/                  # frontend React + Vite
├─ worker/               # API dan handler scheduled (Cron)
├─ migrations/           # migrasi D1, berurutan dan bernomor
├─ public/               # manifest PWA, ikon
├─ docs/                 # dokumen aman-publik: PRD, ADR, spesifikasi API (lihat 21.6)
├─ tests/                # unit dan e2e
├─ wrangler.toml         # konfigurasi Cloudflare
├─ .env.example          # contoh variabel, tanpa nilai rahasia
└─ README.md
```

**Arsitektur hosting (keputusan final):** satu Cloudflare Worker dengan Static Assets yang melayani frontend, API, dan handler `scheduled`. Konsekuensinya: satu origin (cookie identitas aman), satu deployment, satu konfigurasi. Fallback (Pages untuk frontend/API + Worker Cron terpisah) hanya dipertimbangkan jika Spike Pengingat gagal. Kemampuan dan batas paket tetap diverifikasi di dokumentasi Cloudflare terbaru; fitur dan paket dapat berubah.

### 21.3 Alur Git dan kolaborasi

- `main` adalah versi produksi dan dilindungi; tidak ada push langsung.
- Cabang kerja dari `main`: `feat/...`, `fix/...`, `docs/...`. Buat PR kecil dan sering.
- Minimal satu reviewer. Checklist PR: merujuk ID kebutuhan (mis. FR-12), tes lulus, tidak ada secret, dokumentasi terkait diperbarui.
- Pesan commit mengikuti Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- Backlog di GitHub Issues/Projects, diberi label epik dan ID FR.
- Setiap PR mendapat URL preview untuk dicoba sebelum digabung.
- Coding agent bekerja di cabang fitur kecil dan tidak menggabungkan ke `main` tanpa persetujuan product owner. Commit dan push ke GitHub dilakukan secara eksplisit, tidak otomatis.

### 21.4 Environment dan secret

| Aspek | Lokal | Preview | Produksi |
|---|---|---|---|
| Database | D1 lokal via Wrangler | D1 terpisah untuk preview | D1 produksi |
| Secret (`GEMINI_API_KEY` jika provider disetujui, VAPID, Turnstile) | `.dev.vars` (tidak di-commit) | Secret preview di Cloudflare | Worker Secrets di Cloudflare |
| Model/config (`GEMINI_MODEL` jika Gemini disetujui) | nilai di `.dev.vars`/konfigurasi lokal (bukan rahasia) | konfigurasi preview | konfigurasi produksi |
| Kunci | Kunci uji | Kunci terpisah | Kunci terpisah |
| Data | Data contoh | Data uji | Data pengguna nyata |

- Hanya `.env.example` yang masuk repo; `.dev.vars` masuk `.gitignore`. `GEMINI_API_KEY` tidak pernah dimasukkan ke `.env.example` selain nama variabel dan placeholder kosong. `GEMINI_MODEL` adalah konfigurasi non-secret, tetapi jangan menetapkannya sebelum gerbang provider lolos.
- Migrasi D1 berupa berkas berurutan di `migrations/`; diterapkan otomatis ke preview dan ke produksi setelah persetujuan.
- Jika ada secret bocor, putar (rotate) segera dan catat di Dokumentasi CatatKu (tanpa menuliskan nilai secret).

### 21.5 CI/CD

1. PR dibuka, lalu CI menjalankan lint, typecheck, unit test, dan build.
2. Deploy preview otomatis; reviewer mencoba fitur di URL preview.
3. Setelah disetujui dan digabung ke `main`, deploy produksi berjalan.
4. Smoke test pasca-deploy: halaman termuat, endpoint kesehatan (`/api/health`) merespons, Cron terdaftar.
5. Catat perubahan di changelog dan (jika menyentuh PRD) naikkan versi PRD.

**Rollback:** deploy ulang commit sebelumnya. Agar aman, migrasi database dibuat *additive* (menambah, bukan menghapus/mengubah kolom lama) sehingga versi kode lama tetap berjalan pada skema baru.

### 21.6 Dokumentasi proyek dengan Obsidian

**Fungsi:** Obsidian dipakai **hanya untuk dokumentasi**, dari awal pembuatan sampai hasil jadi. Ia tidak menyentuh kode atau fitur CatatKu; ia membuka berkas Markdown langsung dari folder (vault).

**Dua berkas hidup di vault pribadi pemilik proyek:**

```
(vault pribadi)/
├─ projek/
│  └─ Dokumentasi CatatKu.md        # status proyek, tugas berjalan, fitur selesai, hasil tes, kendala, pekerjaan berikutnya
└─ arsip/
   └─ Riwayat Pembuatan CatatKu.md  # riwayat milestone, perubahan besar, keputusan teknis, dan rilis dari awal sampai selesai
```

Folder lain di vault pribadi berada di luar lingkup proyek ini: tidak diubah dan tidak dipublikasikan.

**Dokumen aman-publik di repo (`docs/`):** PRD versi berjalan, ADR, spesifikasi API, README/panduan pengguna, dan catatan rilis. Isinya tidak boleh memuat data pribadi, catatan wawancara mentah, maupun isi vault pribadi.

**Aturan pembaruan oleh coding agent:** setelah setiap tugas selesai, perbarui `Dokumentasi CatatKu.md` berdasarkan keadaan kode yang sebenarnya. Minimal memuat: tugas yang diselesaikan, file yang diubah, tes yang dijalankan, hasil tes, bug yang tersisa, dan langkah berikutnya. Perubahan besar, keputusan teknis, penyelesaian milestone, dan rilis dicatat juga di `Riwayat Pembuatan CatatKu.md`. Dokumentasi tidak boleh menyatakan sesuatu selesai jika belum dijalankan atau diuji.

**Sinkronisasi ke GitHub:** berkas yang disimpan langsung terlihat di Obsidian. Agar salinannya muncul di repo atau GitHub diperlukan commit dan push (atau sinkronisasi Git yang dikonfigurasi); membuka Obsidian tidak menyinkronkan apa pun secara otomatis. Jangan mengunggah seluruh vault pribadi ke repositori publik; hanya kode CatatKu dan dokumen aman-publik yang dibagikan.

**Aturan privasi:** catatan wawancara berisi data pribadi. Anonimkan narasumber (P1, P2, dst.) dan simpan hanya di vault pribadi, tidak di repo (repo kode dapat open-source, Bagian 14).

**Template minimal:** ADR (konteks, opsi, keputusan, konsekuensi), laporan benchmark AI (kandidat, syarat provider, set poster uji, metrik, kuota, keputusan), dan catatan akhir tugas (sesuai aturan pembaruan di atas).

**Isi dokumentasi per tahap:**

| Tahap | Yang dicatat | Tempat |
|---|---|---|
| Persiapan | PRD, keputusan final | `docs/` (repo) |
| Milestone M1 sampai M5 | Status, tes, kendala, langkah berikutnya | Dokumentasi CatatKu |
| Spike | Hasil percobaan dan ADR | `docs/` (ADR), ringkasan di Dokumentasi CatatKu |
| Pengujian | Hasil uji dibanding Bagian 15, bug, dan keterbatasan | Dokumentasi CatatKu |
| Hasil jadi | Catatan rilis, panduan pengguna, laporan akhir, retrospektif | `docs/` dan Riwayat Pembuatan CatatKu |

### 21.7 Breakdown tugas dan Definition of Done

**Definition of Done per tahap:**

| Tahap | Dianggap selesai bila |
|---|---|
| 1 Validasi | ≥ 8 wawancara/observasi tercatat (usulan); Bagian 2 dan 2.1 diperbarui; keputusan lanjut atau ubah arah ditulis |
| 2 UI/UX | Wireframe semua alur utama (7A, 7C, 7D, 7E, 7F); diuji dengan ≥ 5 calon pengguna; baseline metrik tercatat; masalah kegunaan berat diperbaiki |
| 2B Spike | Setiap spike dijawab tertulis (ADR) sebelum milestone yang bergantung padanya: hasil Spike Pengingat (CPU, subrequest, ketepatan waktu) dan keputusan hosting/biaya sebelum M3; tingkat offline (tambah/edit atau baca-saja) diputuskan sebelum sinkron offline dibangun; akurasi poster sebelum M4; status Voice Note sebelum M5; target Bagian 15 ditinjau ulang |
| 3 MVP | Semua FR Must lulus kriteria penerimaannya (FR-26 hanya jika gerbang Spike lolos); M1 sampai M5 masing-masing memiliki demo yang tercatat; CI hijau; terdeploy ke produksi; tidak ada bug blocker terbuka |
| 4 Pengujian | Skenario Bagian 16 dijalankan dan hasilnya dibandingkan dengan metrik Bagian 15; demo sudah dilatih; keterbatasan dituliskan; dokumentasi hasil jadi (catatan rilis, panduan pengguna, laporan akhir, retrospektif) lengkap dan tercatat di Riwayat Pembuatan CatatKu |

**Epik Tahap 3** (ukuran relatif S/M/L; durasi diisi tim setelah kapasitas diketahui):

| Epik | Isi (FR terkait) | Ukuran | Bergantung pada |
|---|---|---|---|
| E1 Fondasi | Repo, CI/CD, PWA shell dan cache offline, skema D1, penyimpanan lokal IndexedDB, UUID klien, identitas instalasi satu origin, tema (FR-15, 17, 18, 25) | M | Hasil Spike |
| E2 Kegiatan dan kalender | CRUD berbasis data lokal, kalender, agenda, status, riwayat (FR-01 sampai 07, 14) | L | E1 |
| E2b Sinkronisasi dan offline | Sinkron dasar ke server; lalu (jika gerbang lolos) tambah/edit/hapus offline, antrean, idempotensi, revisi, tombstone, indikator dan penanda sinkron (FR-27, 28, 26, 29) | L | E2, E5 (gerbang Spike untuk FR-26) |
| E3 Pengingat dan Push | Aturan pengingat, subscription, Cron, pemberitahuan privasi (FR-11, 12, 13, 30; FR-12b sebagai Should menyusul) | L | E2b (sinkron dasar), hasil Spike Pengingat |
| E4 Poster AI | Unggah, ekstraksi, draf, kandidat tanggal (FR-08 sampai 10, 09b) | L | E1 (dapat paralel dengan E3 bila ada kapasitas) |
| E5 Cadangan dan privasi | Ekspor/impor, hapus semua data, masa simpan server (FR-19, 23, 31) | M | E2 |
| E6 Anti-penyalahgunaan | Rate limit, batas global, Turnstile (FR-24) | S | E4 |
| E7 Voice Note (kondisional) | FR-20 | M | E2, keputusan Spike |
| E8 QA dan rilis | Bagian 16, perbaikan bug, deploy produksi | M | Semua epik |

**Urutan pengerjaan mengikuti milestone di bawah.** E3 bergantung pada sinkron dasar dari E2b. E4 secara teknis independen dan dapat dikerjakan paralel bila kapasitas tim ada, tetapi dijadwalkan setelah pengingat terbukti agar risiko terbesar dibuktikan lebih dulu (akurasi AI sudah diuji lebih awal pada Spike). Jika gerbang offline tidak lolos, E2b dipersempit menjadi sinkron dasar dan offline baca-saja (FR-25, 28).

**Milestone Tahap 3** (selesai hanya bila hasil demonya dapat dijalankan dan dicatat di Dokumentasi CatatKu):

| Milestone | Isi | Epik | Hasil yang dapat diperiksa |
|---|---|---|---|
| M1 Fondasi, kalender, CRUD | Repo, CI/CD, PWA shell, tema, CRUD kegiatan berbasis data lokal, kalender bulanan/agenda | E1 (awal), E2 | PWA terbuka di HP dan desktop; kegiatan dapat ditambah, diedit, diselesaikan, dan dihapus lalu tampil benar di kalender dan agenda; CI hijau; terdeploy di preview |
| M2 Penyimpanan lokal, ekspor/impor, offline baca | Persistensi IndexedDB, cache app shell, ekspor/impor, hapus data lokal | E1 (cache), E5 | Data bertahan setelah aplikasi ditutup; aplikasi terbuka dan menampilkan kegiatan dalam mode pesawat; ekspor lalu impor di instalasi baru memulihkan semua kegiatan tanpa duplikasi |
| Spike Pengingat (gerbang) | Prototipe Worker + Cron + D1 + Web Push | Spike | Notifikasi tiba di perangkat uji saat aplikasi ditutup; CPU dan subrequest tercatat dibanding batas gratis; keputusan biaya dibuat (ADR); jika belum layak, integrasi M3 tidak dimulai |
| M3 Backend, sinkronisasi, Web Push | API sinkron, D1, Cron, subscription, aturan pengingat harian, pemberitahuan privasi; offline tambah/edit bila gerbang lolos | E2b, E3 | Kegiatan dari perangkat tersinkron ke server; pengingat harian tiba sesuai hasil Spike saat aplikasi ditutup; berhenti setelah selesai/dibatalkan berdasarkan status server; status sinkron tampil; hasil uji dibanding batas Workers Free. Pengingat sebelum mulai hanya diuji/dibangun jika FR-12b dikerjakan sebagai Should. |
| M4 AI pembaca poster | Unggah, ekstraksi, kandidat tanggal, draf, perlindungan endpoint | E4, E6 | Poster menjadi draf yang dikonfirmasi dan tersimpan; provider telah lolos gerbang ketentuan penggunaan; poster banyak tanggal ditangani; rate limit dan Turnstile aktif; kuota habis menampilkan fallback manual; akurasi diukur pada set uji |
| M5 Pengujian, keamanan, rilis | Uji lintas perangkat (Chrome Android, desktop, iOS PWA), uji keamanan dasar, Voice Note bila lolos, job masa simpan, dokumentasi hasil jadi | E7, E8, FR-31 | Skenario Bagian 16 dijalankan dan dibandingkan dengan Bagian 15; kepemilikan data dan rate limit teruji; ketentuan provider AI produksi sudah ditinjau dan dinyatakan sesuai atau Gemini dinonaktifkan untuk produksi; dokumentasi hasil jadi lengkap (Riwayat Pembuatan CatatKu, catatan rilis, panduan pengguna) |

### 21.8 Pengujian otomatis, pemantauan, dan dokumen lanjutan

- **Unit test** untuk logika murni aturan pengingat dan status (prioritas tertinggi), termasuk batas tanggal UTC vs Asia/Jakarta, serta logika antrean sinkron (urutan, idempotensi, revisi, tombstone).
- **Uji e2e** (mis. Playwright) untuk alur utama: tambah kegiatan, unggah poster (layanan AI di-mock), ekspor/impor, dan skenario offline lalu online (mode offline browser pada alat uji).
- **Pemantauan:** log error Worker; cek pemakaian kuota (Workers, D1, AI) rutin mingguan dan beri tanda bila mendekati batas.
- **Dokumen lanjutan yang perlu dibuat** (di `docs/`): spesifikasi API (endpoint, format request/response, kode error), rencana pengujian otomatis, dan runbook singkat untuk insiden umum (kuota habis, push gagal, Cron tidak jalan).

### 21.9 Aturan kerja coding agent dan pembekuan lingkup

- Kerjakan **satu milestone pada satu waktu**; lanjut hanya setelah hasilnya dapat diperiksa (demo di localhost).
- Satu tugas kecil per langkah, dengan kriteria selesai yang jelas.
- **Jangan menambah fitur di luar PRD.** Perubahan lingkup hanya lewat keputusan tertulis (ADR) yang disetujui product owner dan memperbarui PRD.
- Setelah tiap tugas: jalankan tes yang relevan, perbarui dokumentasi (21.6), dan laporkan file yang diubah, hasil tes, bug yang tersisa, serta langkah berikutnya.
- Minta persetujuan sebelum mengubah skema data atau format ekspor, menambah dependensi besar, mengubah arsitektur, atau melewati batas layanan gratis. Hermes boleh mengevaluasi dan merekomendasikan model dalam batas yang telah disetujui, tetapi tidak boleh mengaktifkan billing, model/layanan berbayar, atau provider yang ketentuannya tidak sesuai. Pemilihan model AI produksi harus dicatat di ADR setelah gerbang ketentuan dan benchmark; bila Gemini tidak sesuai untuk produksi publik, hentikan jalur Gemini dan rekomendasikan OCR lokal/provider lain yang memenuhi ketentuan.
- Jangan menaruh secret di repo, dan jangan mengakses atau mengubah folder vault di luar dua berkas dokumentasi yang ditentukan.
- Jangan menyatakan fitur selesai tanpa bukti (tes atau demo).
- **Pembekuan lingkup:** hingga MVP (M1 sampai M5) selesai, tidak ada fitur baru di luar PRD ini. Ide baru dicatat di daftar fase lanjutan (Bagian 6.2).

---

**Catatan:** PRD v2.1 adalah baseline development dengan lingkup dibekukan. Hasil benchmark dan pilihan model/provider AI belum diketahui dan tidak boleh dikarang; keputusan itu baru dibuat setelah gerbang ketentuan provider dan Spike yang relevan selesai. Sebelum rilis publik, validasi ketentuan provider, kuota layanan, keamanan, serta pengingat pada perangkat sasaran.

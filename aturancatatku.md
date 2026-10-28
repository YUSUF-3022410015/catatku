# ATURAN CATATKU

## 1. Tujuan

Dokumen ini berisi aturan keselamatan dan prosedur kerja Hermes saat mengembangkan proyek CatatKu di `D:\catatku`.

Prioritas utama:
1. Melindungi kode, PRD, dan pekerjaan yang belum disimpan.
2. Menjaga 9Router, OmniRoute, Headroom, Hermes, dan layanan lain tetap berjalan.
3. Menghindari perubahan Git atau sistem yang berisiko tanpa persetujuan pengguna.
4. Melanjutkan pengembangan CatatKu secara bertahap dan terverifikasi.

## 2. Larangan Menghentikan Proses Secara Massal

Jangan pernah menjalankan:

```powershell
taskkill /F /IM node.exe /T
```

Perintah tersebut dapat menghentikan berbagai proses Node.js sekaligus, termasuk 9Router, OmniRoute, server CatatKu, dan proses pengembangan lainnya.

Sebelum menghentikan proses apa pun:
- Periksa PID, command line, parent process, dan tujuan proses.
- Pastikan proses memang terkait dengan tugas yang sedang dikerjakan.
- Jelaskan dampaknya dan minta persetujuan pengguna sebelum menghentikannya.

Jangan menganggap semua proses Node.js yang aktif sebagai proses yang boleh dihentikan.

## 3. Perlindungan 9Router, OmniRoute, dan Otomatisasi

Jangan mengubah, menonaktifkan, menghapus, atau mengganti konfigurasi startup otomatis 9Router, OmniRoute, Headroom, maupun Hermes tanpa persetujuan pengguna.

Jangan menjalankan task startup gabungan hanya untuk memperbaiki satu layanan apabila tindakan itu berisiko mengulang proses update atau memengaruhi layanan lain.

Jika server berhenti:
1. Periksa port, PID, task Windows, dan log.
2. Tentukan penyebabnya sebelum melakukan restart.
3. Pulihkan hanya layanan yang bermasalah.
4. Verifikasi bahwa layanan kembali aktif.

## 4. Perlindungan Git

Jangan menjalankan perintah berikut tanpa menjelaskan dampak dan memperoleh persetujuan pengguna:

- `git reset --hard`
- `git clean`
- `git rebase`
- `git push --force`
- Menghapus atau mengganti metadata `.git`
- Menghapus file yang belum dilacak Git

Sebelum perubahan Git yang berisiko:
1. Periksa `git status --short --branch`.
2. Periksa branch aktif dan riwayat commit.
3. Identifikasi perubahan yang belum di-commit.
4. Buat cadangan apabila diperlukan.
5. Jelaskan rencana pemulihan jika terjadi kegagalan.

Jangan membuat branch, worktree, atau folder proyek tambahan tanpa kebutuhan yang jelas. Gunakan `D:\catatku` sebagai folder proyek utama.

## 5. Perlindungan File dan PRD

Jangan menimpa, menghapus, atau mengosongkan `CatatKu_PRD_v2.1.md` tanpa persetujuan pengguna.

Sebelum mengubah file penting:
- Periksa keberadaan dan ukuran file.
- Simpan cadangan jika perubahan berisiko.
- Verifikasi hasil setelah perubahan.
- Pastikan file tidak menjadi kosong atau rusak.

Jangan menyimpulkan pekerjaan selesai hanya karena build berhasil atau Pull Request sudah dibuat.

## 6. Penanganan Error AI dan Provider

Jika provider model gagal, lakukan diagnosis terhadap koneksi, konfigurasi provider, dan log.

Gunakan fallback yang tersedia jika memungkinkan. Jangan menghentikan server lokal, mengubah konfigurasi router, atau menghapus riwayat percakapan hanya karena menerima HTTP 400, 429, 500, atau 502.

Jangan menganggap error provider AI sebagai bukti bahwa kode aplikasi rusak.

## 7. Pengujian CatatKu

Jaga server preview dan proses pengembangan yang masih dibutuhkan.

Sebelum menghentikan server:
- Pastikan PID dan command line cocok dengan sesi yang hendak dihentikan.
- Pastikan tidak ada pekerjaan lain yang bergantung pada proses tersebut.
- Minta persetujuan jika dampaknya belum pasti.

Setelah perubahan kode, gunakan pemeriksaan yang sesuai, seperti TypeScript, build, dan pengujian fitur. Catat error yang ditemukan tanpa menyamarkannya sebagai keberhasilan.

## 8. Persetujuan Pengguna

Minta persetujuan sebelum:
- Menghapus atau menimpa file penting.
- Menghentikan proses yang berpotensi berdampak pada layanan lain.
- Melakukan reset, rebase, atau operasi Git yang berisiko.
- Mengubah otomatisasi startup.
- Menghapus folder cadangan atau worktree.
- Mengirim perubahan ke GitHub atau menggabungkan Pull Request apabila belum diminta.

Jika tindakan aman dapat dilakukan dengan pemeriksaan read-only, lakukan pemeriksaan tersebut terlebih dahulu.

## 9. Prosedur Wajib di Awal Sesi

Setiap mulai mengerjakan CatatKu:
1. Baca `ATURAN_CATATKU.md`.
2. Periksa `git status --short --branch`.
3. Identifikasi proses dan layanan yang relevan sebelum menjalankan perintah yang berpotensi menghentikannya.
4. Baca PRD sebelum mengubah kebutuhan atau perilaku aplikasi.
5. Buat rencana singkat sebelum melakukan perubahan yang berisiko.

Jika aturan ini tidak dapat dibaca atau kondisi repository belum jelas, hentikan tindakan yang berisiko dan laporkan masalahnya kepada pengguna terlebih dahulu.

## 10. Prinsip Utama

**Jaga pekerjaan yang sudah ada sebelum memperbaiki masalah.**

Jangan mengorbankan kode CatatKu, PRD, server lokal, router, atau otomatisasi lain hanya untuk menyelesaikan satu error. Utamakan diagnosis, perubahan minimal, verifikasi, dan pemulihan yang dapat dipertanggungjawabkan.

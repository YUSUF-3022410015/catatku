# Dokumentasi CatatKu

## Status Proyek

**Baseline development (M1) — Progress: 70%**

### Yang sudah selesai:

| Milestone | Status |
|---|---|
| M1 (Fondasi, kalender, CRUD) | ✅ Selesai |
| M2 (Offline baca, ekspor/impor) | ✅ Selesai |
| Spike Pengingat | ✅ Selesai |

### Fitur MVP yang sudah tersedia:

- Web responsif PWA dengan cache offline
- CRUD kegiatan manual (Create, Read, Update, Delete)
- Kalender bulanan dengan agenda harian
- Status kegiatan: active, completed, cancelled
- Ekspor/Impor data JSON (tanpa duplikasi)
- Identitas instalasi otomatis (tanpa login)
- Tema System/Light/Dark
- Service Worker/PWA shell
- IndexedDB sebagai sumber data utama
- Backend sinkronisasi (`/api/sync`)
- Antrean sinkron offline (idempoten)
- Subscription Web Push
- Worker Cron untuk pengingat
- Handler `scheduled` di Workers

### Yang belum dikerjakan:

| FR | Fitur | Status |
|---|---|---|
| FR-08/09/10 | AI/OCR poster | Belum |
| FR-12b | Pengingat sebelum mulai | Belum |
| FR-20 | Voice Note | Belum |
| FR-23 | Hapus semua data saya | Belum |
| FR-24 | Rate limit & Turnstile | Belum |
| FR-30 | Pemberitahuan privasi | Belum |
| FR-31 | Job retensi server | Belum |

### Masalah terbuka:

- FR-23 (Hapus semua data) perlu implementasi backend
- FR-24 (Rate limit) perlu implementasi di API routes
- FR-30 (Pemberitahuan privasi) perlu UI saat first-time aktifkan pengingat
- FR-31 (Job retensi) perlu cron job terpisah

### Langkah berikutnya (M3):

1. Test kirim notifikasi real ke browser (perlu running worker)
2. Verifikasi notifikasi tiba dengan VAPID keys
3. Update dokumentasi API endpoints
4. Mulai implementasi FR-23, FR-24, FR-30

### Riwayat tugas terakhir:

- 2026-10-28: Spike Pengingat selesai
  - Worker + Cron Triggers berjalan
  - D1 schema ter-apply
  - Query cron berhasil temukan event jatuh tempo
  - VAPID keys tersimpan di `.dev.vars`
  - Subscription dan event ter-link dengan benar

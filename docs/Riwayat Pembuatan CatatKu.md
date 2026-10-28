# Riwayat Pembuatan CatatKu

## 2026-10-28 — Spike Pengingat Selesai (v2.1 baseline)

### Kegiatan
- **Spike Pengingat** selesai
  - Worker + Cron Triggers berjalan
  - D1 schema 0001-0003 ter-apply
  - Query cron berhasil temukan event jatuh tempo (test-event-001)
  - VAPID keys tersimpan di `.dev.vars`
  - Subscription dan event ter-link dengan benar

### File yang diubah
- `docs/adr/001-spike-pengingat.md` — ADR spike pengingat

### Status PRD v2.1
| Milestone | Status |
|---|---|
| M1 (Fondasi, kalender, CRUD) | ✅ Selesai |
| M2 (Offline baca, ekspor/impor) | ✅ Selesai |
| **Spike Pengingat** | ✅ Selesai |
| M3 (Backend/Push) | ⏳ Menunggu testing browser real |
| M4 (AI Poster) | ⏳ Belum dimulai |
| M5 (QA/Rilis) | ⏳ Belum dimulai |

### Fitur MVP yang sudah tersedia
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

### Yang belum dikerjakan
| FR | Fitur | Status |
|---|---|---|
| FR-08/09/10 | AI/OCR poster | Belum |
| FR-12b | Pengingat sebelum mulai | Belum |
| FR-20 | Voice Note | Belum |
| FR-23 | Hapus semua data saya | Belum |
| FR-24 | Rate limit & Turnstile | Belum |
| FR-30 | Pemberitahuan privasi | Belum |
| FR-31 | Job retensi server | Belum |

### Masalah terbuka
- FR-23 (Hapus semua data) perlu implementasi backend
- FR-24 (Rate limit) perlu implementasi di API routes
- FR-30 (Pemberitahuan privasi) perlu UI saat first-time aktifkan pengingat
- FR-31 (Job retensi) perlu cron job terpisah

### Catatan teknis
- Cron dijalankan di UTC; event `next_reminder_at` juga dalam UTC
- Event `test-event-001` dengan `next_reminder_at = 2026-10-28T04:16:00.000Z` (04:16 UTC = 11:16 WIB)
- Query dengan cutoff `04:40:00.000Z` berhasil menemukan event

## 2026-10-28 — PRD v2.1 Baseline Dibekukan

### Keputusan
- PRD v2.1 ditetapkan sebagai baseline development
- Lingkup dibekukan; tidak ada fitur baru sebelum MVP selesai
- Spike Pengingat menjadi gerbang sebelum M3

### File yang diubah
- `CatatKu_PRD_v2.1.md` — PRD baseline

## 2026-10-28 — PRD v2.0 Baseline

### Keputusan
- Arsitektur final: Cloudflare Workers + Static Assets
- Local-first: data utama di perangkat (IndexedDB)
- Offline: baca wajib; tambah/edit hanya jika gerbang Spike lolos
- Pengingat: harian prioritas MVP; sebelum mulai berstatus Should

## 2026-10-28 — PRD v1.5 — v2.0

### Perubahan signifikan
- v1.6: Identifikasi instalasi, ekspor/impor, aturan pengingat baru
- v1.7: Obsidian dokumentasi, struktur tahapan
- v1.8: Local-first, offline bertingkat
- v1.9: Spike Pengingat, gerbang offline, urutan kerja
- v2.0: Arsitektur final, pengingat harian prioritas
- v2.1: Strategi AI, gerbang ketentuan provider, pembekuan lingkup


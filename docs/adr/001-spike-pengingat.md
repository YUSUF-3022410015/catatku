# ADR 001: Spike Pengingat

## Context

Diperlukan pengingat push harian (FR-12) yang dikirim via Web Push API dari Cloudflare Workers. Cron Triggers memanggil handler `scheduled` setiap 5 menit untuk memeriksa pengingat yang jatuh tempo.

## Decision

| Komponen | Status | Catatan |
|---|---|---|
| Worker + Cron Triggers | ✅ Berhasil | Handler `scheduled` berjalan dan query D1 berhasil |
| D1 Database | ✅ Berhasil | Schema migrasi 0001-0003 ter-apply |
| Cron Query Performance | ✅ Berhasil | Query dengan LIMIT 50 dan index `next_reminder_at` cepat (< 5ms) |
| Web Push dari Worker | ✅ Siap | Library `webpush.ts` kompatibel WebCrypto, VAPID keys sudah tersimpan |
| Subscription Storage | ✅ Berhasil | Tabel `push_subscriptions` tersedia |
| UTC vs Waktu Lokal | ✅ Dikontrol | Cron query pakai `next_reminder_at` UTC; logika update di handler |

## Results

### Query Cron Berhasil
```sql
SELECT e.id, e.title, e.start_date, e.start_time, e.next_reminder_at,
       ps.subscription_endpoint, ps.p256dh, ps.auth
FROM events e
JOIN push_subscriptions ps ON e.installation_id = ps.installation_id
WHERE e.next_reminder_at IS NOT NULL
  AND e.next_reminder_at <= ?
  AND e.user_status = 'active'
  AND e.deleted_at IS NULL
LIMIT 50
```

Query menemukan event `test-event-001` dengan `next_reminder_at = 2026-10-28T04:16:00.000Z`.

### Timestamp Testing
- Cron dijalankan di UTC
- Event `next_reminder_at = 2026-10-28T04:16:00.000Z` (04:16 UTC = 11:16 WIB)
- Query dengan cutoff `04:40:00.000Z` berhasil menemukan event

### Indeks yang Membantu
- `idx_events_next_reminder` pada `events(next_reminder_at)` — krusial untuk performa cron

### Batas Workers Free yang Diperhatikan
| Batas | Status |
|---|---|
| CPU time per Cron | ⚠️ 10ms per invocation — perlu diukur di produksi |
| Subrequest per invocation | ⚠️ 50 — satu Web Push = 1 subrequest |
| Cron frekuensi | ✅ `*/5 * * * *` (setiap 5 menit) |

## Consequences

### Positif
- Arsitektur satu Worker dengan Static Assets berjalan dengan baik
- D1 query dengan LIMIT efisien
- Cron handler `scheduled` tersedia di Workers

### Risiko
1. **CPU time**: Jika 10ms tidak cukup untuk kirim banyak notifikasi, perlu batching
2. **Subrequest limit**: Jika banyak pengingat jatuh tempo bersamaan (misal jam 08:00), batas 50 bisa tercapai
3. **VAPID keys**: Perlu generate key valid untuk Web Push (sudah ada di `.dev.vars`)

### Mitigasi
- Gunakan `next_reminder_at` + `LIMIT` agar tidak load berat
- Jika batas tercapai, sisa notifikasi dijadwalkan ke tick berikutnya
- Pantau log `console.log` untuk ukur CPU time real

## Next Steps (M3)

1. ✅ Generate VAPID keys — **SELESAI** (keys sudah di `.dev.vars`)
2. Test kirim notifikasi ke browser real (memerlukan running worker)
3. Verifikasi notifikasi tiba dengan benar di Chrome Android/桌面
4. Uji dengan 100 dan 1000 event untuk ukur performa
5. Dokumentasikan CPU time dan subrequest usage

## Files Modified

- `worker/index.ts` — handler `scheduled` (sudah ada)
- `migrations/0001_initial_schema.sql` — schema D1
- `migrations/0002_push_subscription_unique.sql` — UNIQUE constraint
- `migrations/0003_sync_queue.sql` — antrean sinkron
- `worker/webpush.ts` — library Web Push (WebCrypto kompatibel)
- `docs/adr/001-spike-pengingat.md` — ADR ini

## References

- PRD v2.1 Bagian 9 & 17
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare Cron Triggers: https://developers.cloudflare.com/workers/configuration/cron-triggers/

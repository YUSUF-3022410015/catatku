INSERT OR REPLACE INTO installations (installation_id, installation_token_hash, created_at, updated_at)
VALUES ('test-install-001', 'dummy_hash_abc123', '2026-10-28T04:00:00.000Z', '2026-10-28T04:00:00.000Z');

INSERT OR REPLACE INTO events (
  id, installation_id, title, description, start_date, start_time,
  user_status, daily_reminder_enabled, daily_reminder_time, daily_window_days,
  next_reminder_at, created_at, updated_at
) VALUES (
  'test-event-001', 'test-install-001', 'Uji Pengingat Spike', 'Event untuk testing cron',
  '2026-10-28', '11:10', 'active', 1, '11:10', 7,
  '2026-10-28T04:12:00.000Z', '2026-10-28T04:00:00.000Z', '2026-10-28T04:00:00.000Z'
);

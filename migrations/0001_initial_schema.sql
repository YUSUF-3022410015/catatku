-- Migrasi D1 CatatKu: Schema Awal (PRD v2.1 Bagian 12)

-- Tabel Instalasi
CREATE TABLE IF NOT EXISTS installations (
  installation_id TEXT PRIMARY KEY,
  installation_token_hash TEXT NOT NULL,
  display_name TEXT,
  timezone TEXT DEFAULT 'Asia/Jakarta',
  last_seen_at TEXT,
  theme_preference TEXT DEFAULT 'system',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Tabel Kegiatan
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date TEXT NOT NULL,
  start_time TEXT,
  end_date TEXT,
  end_time TEXT,
  is_all_day INTEGER DEFAULT 0,
  location TEXT,
  category TEXT,
  user_status TEXT DEFAULT 'active',
  source_type TEXT DEFAULT 'manual',
  date_label TEXT,
  daily_reminder_enabled INTEGER DEFAULT 0,
  daily_reminder_time TEXT,
  daily_window_days INTEGER DEFAULT 7,
  last_reminded_local_date TEXT,
  next_reminder_at TEXT,
  pre_start_offset_minutes INTEGER,
  pre_start_sent_at TEXT,
  revision INTEGER DEFAULT 1,
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (installation_id) REFERENCES installations(installation_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_events_installation ON events(installation_id);
CREATE INDEX IF NOT EXISTS idx_events_next_reminder ON events(next_reminder_at);

-- Tabel Push Subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  subscription_endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_success_at TEXT,
  FOREIGN KEY (installation_id) REFERENCES installations(installation_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_push_installation ON push_subscriptions(installation_id);

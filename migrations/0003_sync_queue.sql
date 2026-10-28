-- Migrasi D1 CatatKu: Tabel sync_queue untuk antrean perubahan offline (FR-26, FR-27)
-- Operasi sinkron idempoten: setiap entry punya op_id unik

-- Tabel Antrean Sinkronisasi
CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  op_id TEXT NOT NULL UNIQUE,           -- ID operasi untuk idempotensi
  installation_id TEXT NOT NULL,
  event_id TEXT,                        -- NULL untuk operasi penghapusan tombstone
  op_type TEXT NOT NULL,                -- 'upsert' atau 'delete'
  payload TEXT NOT NULL,                -- JSON payload
  created_at TEXT NOT NULL,
  attempts INTEGER DEFAULT 0,
  last_error TEXT,
  synced_at TEXT,                       -- NULL jika belum tersinkron
  FOREIGN KEY (installation_id) REFERENCES installations(installation_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sync_installation ON sync_queue(installation_id);
CREATE INDEX IF NOT EXISTS idx_sync_op_id ON sync_queue(op_id);
CREATE INDEX IF NOT EXISTS idx_sync_unsynced ON sync_queue(installation_id, synced_at);

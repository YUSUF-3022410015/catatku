-- Migrasi D1 CatatKu: tambah UNIQUE constraint pada subscription_endpoint
-- Dibutuhkan untuk upsert ON CONFLICT di /api/subscribe

CREATE UNIQUE INDEX IF NOT EXISTS idx_push_endpoint_unique ON push_subscriptions(subscription_endpoint);

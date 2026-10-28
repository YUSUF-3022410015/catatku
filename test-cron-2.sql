SELECT e.id, e.title, e.start_date, e.start_time, e.next_reminder_at,
         ps.subscription_endpoint, ps.p256dh, ps.auth
  FROM events e
  JOIN push_subscriptions ps ON e.installation_id = ps.installation_id
  WHERE e.next_reminder_at IS NOT NULL
    AND e.next_reminder_at <= '2026-10-28T05:05:00.000Z'
    AND e.user_status = 'active'
    AND e.deleted_at IS NULL
  LIMIT 50;
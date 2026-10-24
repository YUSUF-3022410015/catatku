import { sendWebPush } from './webpush';

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  VAPID_SUBJECT: string;
}

const JSON_HEADERS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: JSON_HEADERS });

    // GET /api/health
    if (url.pathname === '/api/health' && request.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok', time: new Date().toISOString() }), { headers: JSON_HEADERS });
    }

    // GET /api/vapid-public-key — frontend butuh ini untuk subscribe
    if (url.pathname === '/api/vapid-public-key' && request.method === 'GET') {
      return new Response(JSON.stringify({ key: env.VAPID_PUBLIC_KEY }), { headers: JSON_HEADERS });
    }

    // POST /api/subscribe — simpan push subscription
    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      const body = await request.json() as { installation_id: string; endpoint: string; p256dh: string; auth: string };
      if (!body.installation_id || !body.endpoint || !body.p256dh || !body.auth) {
        return new Response(JSON.stringify({ error: 'field tidak lengkap' }), { status: 400, headers: JSON_HEADERS });
      }
      const now = new Date().toISOString();
      await env.DB.prepare(`
        INSERT INTO push_subscriptions (id, installation_id, subscription_endpoint, p256dh, auth, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(subscription_endpoint) DO UPDATE SET p256dh=excluded.p256dh, auth=excluded.auth, updated_at=excluded.updated_at
      `).bind(crypto.randomUUID(), body.installation_id, body.endpoint, body.p256dh, body.auth, now, now).run();
      return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
    }

    // POST /api/test-push — kirim notifikasi uji (spike only)
    if (url.pathname === '/api/test-push' && request.method === 'POST') {
      const body = await request.json() as { installation_id: string };
      if (!body.installation_id) {
        return new Response(JSON.stringify({ error: 'installation_id wajib' }), { status: 400, headers: JSON_HEADERS });
      }
      const subs = await env.DB.prepare(
        'SELECT subscription_endpoint, p256dh, auth FROM push_subscriptions WHERE installation_id = ?'
      ).bind(body.installation_id).all();

      const results: { endpoint: string; status: number | string }[] = [];
      for (const sub of subs.results as { subscription_endpoint: string; p256dh: string; auth: string }[]) {
        try {
          const r = await sendWebPush({
            endpoint: sub.subscription_endpoint, p256dh: sub.p256dh, auth: sub.auth,
            payload: JSON.stringify({ title: 'CatatKu — Uji Pengingat', body: 'Spike pengingat berhasil!' }),
            vapidPublicKey: env.VAPID_PUBLIC_KEY, vapidPrivateKey: env.VAPID_PRIVATE_KEY, vapidSubject: env.VAPID_SUBJECT,
          });
          results.push({ endpoint: sub.subscription_endpoint.slice(0, 50) + '...', status: r.status });
        } catch (err) {
          results.push({ endpoint: sub.subscription_endpoint.slice(0, 50) + '...', status: String(err) });
        }
      }
      return new Response(JSON.stringify({ sent: results.length, results }), { headers: JSON_HEADERS });
    }

    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response('CatatKu Worker', { status: 200 });
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const started = Date.now();
    const nowUtc = new Date().toISOString();

    // Ambil maks 50 pengingat jatuh tempo (batas subrequest Workers Free)
    const due = await env.DB.prepare(`
      SELECT e.id, e.title, e.start_date, e.start_time, e.next_reminder_at,
             ps.subscription_endpoint, ps.p256dh, ps.auth
      FROM events e
      JOIN push_subscriptions ps ON e.installation_id = ps.installation_id
      WHERE e.next_reminder_at IS NOT NULL
        AND e.next_reminder_at <= ?
        AND e.user_status = 'active'
        AND e.deleted_at IS NULL
      LIMIT 50
    `).bind(nowUtc).all();

    type DueRow = {
      id: string; title: string; start_date: string; start_time: string | null;
      next_reminder_at: string; subscription_endpoint: string; p256dh: string; auth: string;
    };

    for (const row of due.results as DueRow[]) {
      ctx.waitUntil((async () => {
        try {
          await sendWebPush({
            endpoint: row.subscription_endpoint, p256dh: row.p256dh, auth: row.auth,
            payload: JSON.stringify({
              title: `Pengingat: ${row.title}`,
              body: `Tanggal: ${row.start_date}${row.start_time ? ' ' + row.start_time : ''}`,
              url: '/',
            }),
            vapidPublicKey: env.VAPID_PUBLIC_KEY, vapidPrivateKey: env.VAPID_PRIVATE_KEY, vapidSubject: env.VAPID_SUBJECT,
          });
          // Jadwalkan pengingat hari berikutnya pada jam yang sama
          const next = new Date(row.next_reminder_at);
          next.setUTCDate(next.getUTCDate() + 1);
          await env.DB.prepare(
            'UPDATE events SET last_reminded_local_date = ?, next_reminder_at = ? WHERE id = ?'
          ).bind(row.start_date, next.toISOString(), row.id).run();
        } catch {
          // Gagal kirim: coba pada tick berikutnya, data lokal tidak hilang
        }
      })());
    }

    console.log(`Cron: ${due.results.length} pengingat diproses dalam ${Date.now() - started}ms`);
  },
};

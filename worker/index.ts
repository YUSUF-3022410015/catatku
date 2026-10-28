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

    // POST /api/cleanup — hapus semua data saya (FR-23)
    if (url.pathname === '/api/cleanup' && request.method === 'POST') {
      const body = await request.json() as { installation_id: string };
      if (!body.installation_id) {
        return new Response(JSON.stringify({ error: 'installation_id wajib' }), { status: 400, headers: JSON_HEADERS });
      }

      const now = new Date().toISOString();

      // Hapus semua kegiatan (tombstone)
      await env.DB.prepare('UPDATE events SET deleted_at = ? WHERE installation_id = ?').bind(now, body.installation_id).run();
      // Hapus push subscription
      await env.DB.prepare('DELETE FROM push_subscriptions WHERE installation_id = ?').bind(body.installation_id).run();
      // Hapus sync queue
      await env.DB.prepare('DELETE FROM sync_queue WHERE installation_id = ?').bind(body.installation_id).run();
      // Update last_seen_at
      await env.DB.prepare('UPDATE installations SET last_seen_at = ? WHERE id = ?').bind(now, body.installation_id).run();

      return new Response(JSON.stringify({ ok: true, msg: 'Data dihapus.' }), { headers: JSON_HEADERS });
    }

    // POST /api/ai-poster — upload poster untuk OCR/AI ekstraksi (FR-08, FR-09, FR-10)
    if (url.pathname === '/api/ai-poster' && request.method === 'POST') {
      const contentType = request.headers.get('content-type') || '';
      if (!contentType.includes('multipart/form-data')) {
        return new Response(JSON.stringify({ error: 'Hanya menerima multipart/form-data' }), { status: 400, headers: JSON_HEADERS });
      }

      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const installationId = formData.get('installation_id') as string | null;

      if (!file || !installationId) {
        return new Response(JSON.stringify({ error: 'file dan installation_id wajib' }), { status: 400, headers: JSON_HEADERS });
      }

      // Validasi tipe dan ukuran file
      if (!file.type.startsWith('image/')) {
        return new Response(JSON.stringify({ error: 'File harus berupa gambar' }), { status: 400, headers: JSON_HEADERS });
      }
      if (file.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'Ukuran file terlalu besar (max 5 MB)' }), { status: 400, headers: JSON_HEADERS });
      }

      // Placeholder: Ganti dengan Gemini API atau OCR lokal saat ready
      // Untuk spike ini, return dummy data untuk test
      const dummyResult = {
        title: 'Contoh Acara Uji',
        location: 'Kampus UISI',
        candidates: [
          { date: new Date().toISOString().slice(0, 10), time: '09:00', label: 'acara', confidence: 0.95 },
          { date: new Date().toISOString().slice(0, 10), time: '08:00', label: 'pendaftaran', confidence: 0.85 },
        ],
      };

      return new Response(JSON.stringify(dummyResult), { headers: JSON_HEADERS });
    }

    // POST /api/sync — sinkronisasi antrean offline (FR-26, FR-27)
    if (url.pathname === '/api/sync' && request.method === 'POST') {
      const body = await request.json() as { installation_id: string; operations: Array<{ op_id: string; op_type: 'upsert' | 'delete'; payload?: any }> };
      if (!body.installation_id || !Array.isArray(body.operations) || body.operations.length === 0) {
        return new Response(JSON.stringify({ error: 'installation_id dan operations wajib' }), { status: 400, headers: JSON_HEADERS });
      }

      const now = new Date().toISOString();
      const results: { op_id: string; status: string; error?: string }[] = [];

      // Proses tiap operasi secara idempoten
      for (const op of body.operations) {
        if (!op.op_id) {
          results.push({ op_id: '', status: 'failed', error: 'op_id wajib' });
          continue;
        }

        try {
          const existing = await env.DB.prepare(
            'SELECT id FROM sync_queue WHERE op_id = ?'
          ).bind(op.op_id).first<string>();

          if (existing) {
            // Sudah diproses: abaikan (idempotensi)
            results.push({ op_id: op.op_id, status: 'skipped' });
            continue;
          }

          if (op.op_type === 'upsert') {
            const event = op.payload;
            if (!event || !event.id || !event.title) {
              results.push({ op_id: op.op_id, status: 'failed', error: 'payload tidak valid' });
              continue;
            }
            const ev = event as {
              id: string; title: string; description: string;
              start_date: string; start_time?: string; end_date?: string; end_time?: string;
              is_all_day: boolean; location?: string; category?: string;
              user_status: 'active' | 'completed' | 'cancelled'; source_type: 'manual' | 'voice' | 'poster';
              date_label?: 'acara' | 'pendaftaran' | 'tenggat' | 'lainnya';
              daily_reminder_enabled: boolean; daily_reminder_time?: string; daily_window_days: number;
              pre_start_offset_minutes?: number; revision: number;
              created_at: string; updated_at: string;
            };
            // Upsert event
            await env.DB.prepare(`
              INSERT INTO events (
                id, installation_id, title, description, start_date, start_time, end_date, end_time,
                is_all_day, location, category, user_status, source_type, date_label,
                daily_reminder_enabled, daily_reminder_time, daily_window_days, pre_start_offset_minutes,
                revision, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                title=excluded.title, description=excluded.description, start_date=excluded.start_date,
                start_time=excluded.start_time, end_date=excluded.end_date, end_time=excluded.end_time,
                is_all_day=excluded.is_all_day, location=excluded.location, category=excluded.category,
                user_status=excluded.user_status, source_type=excluded.source_type, date_label=excluded.date_label,
                daily_reminder_enabled=excluded.daily_reminder_enabled, daily_reminder_time=excluded.daily_reminder_time,
                daily_window_days=excluded.daily_window_days, pre_start_offset_minutes=excluded.pre_start_offset_minutes,
                revision=excluded.revision, updated_at=excluded.updated_at
            `).bind(
              ev.id, body.installation_id, ev.title, ev.description || '', ev.start_date,
              ev.start_time, ev.end_date, ev.end_time, ev.is_all_day ? 1 : 0,
              ev.location, ev.category, ev.user_status, ev.source_type, ev.date_label,
              ev.daily_reminder_enabled ? 1 : 0, ev.daily_reminder_time, ev.daily_window_days,
              ev.pre_start_offset_minutes, ev.revision, ev.created_at, ev.updated_at
            ).run();
            results.push({ op_id: op.op_id, status: 'success' });
          } else if (op.op_type === 'delete') {
            // Tombstone (jangan delete permanen)
            await env.DB.prepare(
              'UPDATE events SET deleted_at = ? WHERE id = ? AND installation_id = ?'
            ).bind(now, op.payload.id, body.installation_id).run();
            results.push({ op_id: op.op_id, status: 'success' });
          }

          // Catat operasi ke sync_queue
          await env.DB.prepare(`
            INSERT INTO sync_queue (id, op_id, installation_id, event_id, op_type, payload, created_at, synced_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(crypto.randomUUID(), op.op_id, body.installation_id, op.payload?.id, op.op_type, JSON.stringify(op.payload || null), now, now).run();

        } catch (err) {
          // Catat error tapi lanjut operasi lain
          await env.DB.prepare(`
            INSERT INTO sync_queue (id, op_id, installation_id, op_type, payload, created_at, attempts, last_error)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?)
          `).bind(crypto.randomUUID(), op.op_id, body.installation_id, op.op_type, JSON.stringify(op.payload || null), now, String(err)).run();
          results.push({ op_id: op.op_id, status: 'failed', error: String(err) });
        }
      }

      return new Response(JSON.stringify({ results, total: results.length, success: results.filter(r => r.status === 'success').length }), { headers: JSON_HEADERS });
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

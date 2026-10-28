// sync.ts - Sinkronisasi offline dan revision tracking (FR-26, FR-27)
// Antrean sinkron idempoten: setiap operasi punya op_id unik

import { Event } from './db';

type SyncState = 'synced' | 'pending' | 'failed';
type OpType = 'upsert' | 'delete';

export type SyncOperation = {
  op_id: string;
  event_id: string;
  op_type: OpType;
  payload: any;
  created_at: string;
  attempts: number;
  last_error?: string;
};

// Simpan ke localStorage, tidak di-D1 karena tidak ada D1 di frontend
const SYNC_QUEUE_KEY = 'catatku_sync_queue';

export async function getSyncQueue(): Promise<SyncOperation[]> {
  const stored = localStorage.getItem(SYNC_QUEUE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export async function addToSyncQueue(op: Omit<SyncOperation, 'created_at' | 'attempts'>): Promise<void> {
  const queue = await getSyncQueue();
  const existing = queue.find(item => item.op_id === op.op_id);
  if (existing) return; // Idempotensi

  const newOp: SyncOperation = {
    ...op,
    created_at: new Date().toISOString(),
    attempts: 0,
  };
  queue.push(newOp);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

export async function removeFromSyncQueue(op_id: string): Promise<void> {
  const queue = await getSyncQueue();
  const filtered = queue.filter(item => item.op_id !== op_id);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered));
}

export async function incrementSyncAttempts(op_id: string, error?: string): Promise<void> {
  const queue = await getSyncQueue();
  const item = queue.find(i => i.op_id === op_id);
  if (item) {
    item.attempts += 1;
    if (error) item.last_error = error;
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }
}

export async function syncToServer(installationId: string): Promise<{
  total: number;
  success: number;
  failed: number;
  results: Array<{ op_id: string; status: string; error?: string }>;
}> {
  const queue = await getSyncQueue();
  if (queue.length === 0) {
    return { total: 0, success: 0, failed: 0, results: [] };
  }

  const operations = queue.map(({ op_id, event_id, op_type, payload }) => ({
    op_id,
    op_type,
    payload: op_type === 'upsert' ? payload : { id: event_id },
  }));

  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ installation_id: installationId, operations }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json() as { results: Array<{ op_id: string; status: string; error?: string }> };

    // Hapus yang berhasil dari antrean
    for (const r of data.results) {
      if (r.status === 'success' || r.status === 'skipped') {
        await removeFromSyncQueue(r.op_id);
      } else {
        await incrementSyncAttempts(r.op_id, r.error);
      }
    }

    return {
      total: data.results.length,
      success: data.results.filter(r => r.status === 'success' || r.status === 'skipped').length,
      failed: data.results.filter(r => r.status === 'failed').length,
      results: data.results,
    };
  } catch (err) {
    // Gagal sinkron: tingkatkan attempts tapi jangan hapus dari antrean
    for (const op of queue) {
      await incrementSyncAttempts(op.op_id, String(err));
    }
    return {
      total: queue.length,
      success: 0,
      failed: queue.length,
      results: queue.map(op => ({ op_id: op.op_id, status: 'failed', error: String(err) })),
    };
  }
}

export async function ensureRevision(event: Event): Promise<Event> {
  // Jika revision tidak ada, set ke 1; jika ada, naikkan
  const rev = (event.revision || 1) + 1;
  return { ...event, revision: rev, updated_at: new Date().toISOString() };
}

// Cek status sinkronisasi
export function isOnline(): boolean {
  return navigator.onLine;
}

export async function getSyncStatus(): Promise<{ status: SyncState; pending: number }> {
  const queue = await getSyncQueue();
  const pending = queue.length;

  if (!isOnline()) return { status: 'pending', pending };
  if (pending === 0) return { status: 'synced', pending };
  return { status: 'pending', pending };
}

// Trigger sinkron otomatis saat online
export function setupAutoSync(installationId: string): void {
  const handleOnline = async () => {
    // Jangan trigger langsung saat baru online — beri waktu browser restore network
    setTimeout(async () => {
      await syncToServer(installationId);
    }, 1000);
  };

  window.addEventListener('online', handleOnline);
}

// cleanup.ts - FR-23 Hapus semua data saya
// Hapus data lokal dan server-side

import { dbGetAll, dbDelete } from './db';

// Hapus semua kegiatan lokal
export async function cleanupLocalEvents(): Promise<void> {
  const events = await dbGetAll();
  for (const e of events) {
    await dbDelete(e.id);
  }
}

// Hapus pengaturan lokal
export async function cleanupLocalSettings(): Promise<void> {
  localStorage.removeItem('installation_id');
  localStorage.removeItem('theme_preference');
}

// Hapus sync queue lokal
export async function cleanupSyncQueue(): Promise<void> {
  localStorage.removeItem('catatku_sync_queue');
}

// Hapus semua data lokal
export async function cleanupAllLocalData(): Promise<void> {
  await cleanupLocalEvents();
  await cleanupLocalSettings();
  await cleanupSyncQueue();
}

// Hapus data di server
export async function cleanupServerData(installationId: string): Promise<{ ok: boolean; msg: string }> {
  try {
    const res = await fetch('/api/cleanup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ installation_id: installationId }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    return { ok: true, msg: 'Data server dihapus.' };
  } catch (e) {
    return { ok: false, msg: 'Gagal hapus data server: ' + (e as Error).message };
  }
}

// Hapus subscription push di server
export async function cleanupPushSubscription(installationId: string): Promise<void> {
  try {
    const res = await fetch('/api/cleanup-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ installation_id: installationId }),
    });
    if (!res.ok) {
      console.warn('Gagal hapus subscription:', await res.text());
    }
  } catch (e) {
    console.warn('Error hapus subscription:', e);
  }
}

/**
 * notificationSetup.ts
 * Minta izin notifikasi, subscribe Web Push, dan daftar ke backend.
 * Dipanggil saat pengguna pertama kali mengaktifkan pengingat.
 */

export async function getInstallationId(): Promise<string> {
  let id = localStorage.getItem('installation_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('installation_id', id);
  }
  return id;
}

export async function setupNotifications(): Promise<{ ok: boolean; msg: string }> {
  if (!('Notification' in window)) return { ok: false, msg: 'Browser tidak mendukung notifikasi.' };
  if (!('serviceWorker' in navigator)) return { ok: false, msg: 'Service Worker tidak tersedia.' };
  if (!('PushManager' in window)) return { ok: false, msg: 'Push API tidak tersedia di browser ini.' };

  // Minta izin
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return { ok: false, msg: 'Izin notifikasi ditolak.' };

  // Ambil VAPID public key dari backend
  let vapidKey: string;
  try {
    const res = await fetch('/api/vapid-public-key');
    const data = await res.json() as { key: string };
    vapidKey = data.key;
  } catch {
    return { ok: false, msg: 'Gagal mengambil konfigurasi server.' };
  }

  // Subscribe ke Push Manager
  const reg = await navigator.serviceWorker.ready;
  let sub: PushSubscription;
  try {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
  } catch {
    return { ok: false, msg: 'Gagal subscribe push notification.' };
  }

  // Kirim subscription ke backend
  const installationId = await getInstallationId();
  const subJson = sub.toJSON();
  try {
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        installation_id: installationId,
        endpoint: subJson.endpoint,
        p256dh: subJson.keys?.p256dh,
        auth: subJson.keys?.auth,
      }),
    });
  } catch {
    return { ok: false, msg: 'Gagal mendaftarkan subscription ke server.' };
  }

  return { ok: true, msg: 'Notifikasi aktif.' };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const out = new Uint8Array(rawData.length) as Uint8Array<ArrayBuffer>;
  for (let i = 0; i < rawData.length; i++) out[i] = rawData.charCodeAt(i);
  return out;
}

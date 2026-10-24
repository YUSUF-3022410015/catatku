/**
 * Web Push via WebCrypto — kompatibel Cloudflare Workers (RFC 8291).
 */

function b64UrlDecode(str: string): Uint8Array<ArrayBuffer> {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '=');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length) as Uint8Array<ArrayBuffer>;
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64UrlEncode(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Cast Uint8Array ke ArrayBuffer — dibutuhkan TypeScript 7 strict
function ab(u: Uint8Array): ArrayBuffer {
  return u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength) as ArrayBuffer;
}

function concat(...arrays: Uint8Array[]): Uint8Array<ArrayBuffer> {
  const total = arrays.reduce((s, a) => s + a.byteLength, 0);
  const out = new Uint8Array(total) as Uint8Array<ArrayBuffer>;
  let offset = 0;
  for (const a of arrays) { out.set(a, offset); offset += a.byteLength; }
  return out;
}

async function importVapidPrivateKey(pkcs8B64Url: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'pkcs8', ab(b64UrlDecode(pkcs8B64Url)),
    { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']
  );
}

async function buildVapidJwt(endpoint: string, subject: string, privateKey: CryptoKey): Promise<string> {
  const url = new URL(endpoint);
  const audience = `${url.protocol}//${url.host}`;
  const now = Math.floor(Date.now() / 1000);
  const enc = new TextEncoder();
  const header = b64UrlEncode(ab(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' }))));
  const payload = b64UrlEncode(ab(enc.encode(JSON.stringify({ aud: audience, exp: now + 3600, sub: subject }))));
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' }, privateKey,
    ab(enc.encode(`${header}.${payload}`))
  );
  return `${header}.${payload}.${b64UrlEncode(sig)}`;
}

/** Kirim satu Web Push notification. Lempar Error jika gagal. */
export async function sendWebPush(opts: {
  endpoint: string; p256dh: string; auth: string; payload: string;
  vapidPublicKey: string; vapidPrivateKey: string; vapidSubject: string;
}): Promise<{ status: number }> {
  const { endpoint, p256dh, auth, payload, vapidPublicKey, vapidPrivateKey, vapidSubject } = opts;
  const enc = new TextEncoder();

  const serverKP = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const clientPub = await crypto.subtle.importKey('raw', ab(b64UrlDecode(p256dh)), { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const sharedBits = await crypto.subtle.deriveBits({ name: 'ECDH', public: clientPub }, serverKP.privateKey as CryptoKey, 256);
  const serverPubRaw = await crypto.subtle.exportKey('raw', serverKP.publicKey as CryptoKey);
  const authSecret = b64UrlDecode(auth);
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const ikmKey = await crypto.subtle.importKey('raw', sharedBits, 'HKDF', false, ['deriveBits']);
  const prkInfo = ab(concat(enc.encode('WebPush: info\0'), b64UrlDecode(p256dh), new Uint8Array(serverPubRaw)));
  const prk = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: ab(authSecret), info: prkInfo }, ikmKey, 256);
  const prkKey = await crypto.subtle.importKey('raw', prk, 'HKDF', false, ['deriveBits']);

  const cek = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: ab(salt), info: ab(enc.encode('Content-Encoding: aes128gcm\0')) }, prkKey, 128);
  const nonce = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: ab(salt), info: ab(enc.encode('Content-Encoding: nonce\0')) }, prkKey, 96);
  const aesKey = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, ab(concat(enc.encode(payload), new Uint8Array([2]))));

  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096, false);
  const body = ab(concat(salt, rs, new Uint8Array([65]), new Uint8Array(serverPubRaw), new Uint8Array(ciphertext)));

  const privKey = await importVapidPrivateKey(vapidPrivateKey);
  const token = await buildVapidJwt(endpoint, vapidSubject, privKey);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'TTL': '60',
      'Authorization': `vapid t=${token},k=${vapidPublicKey}`,
    },
    body,
  });
  return { status: res.status };
}

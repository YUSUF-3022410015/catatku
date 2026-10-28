// aiPoster.ts - M4 AI/OCR Poster (FR-08, FR-09, FR-10)
// Upload poster dan ekstraksi draf

export interface PosterResult {
  title?: string;
  location?: string;
  candidates: { date: string; time?: string; label: string; confidence: number }[];
}

// Upload poster ke backend untuk AI/OCR processing
export async function uploadPoster(file: File, installationId: string): Promise<{ ok: boolean; data?: PosterResult; error?: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('installation_id', installationId);

  try {
    const res = await fetch('/api/ai-poster', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: errText };
    }

    const data = await res.json() as PosterResult;
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// Fallback: input manual jika AI tidak tersedia
export async function uploadPosterFallback(file: File): Promise<{ ok: boolean; error?: string }> {
  // Cek tipe dan ukuran file di frontend
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: 'File harus berupa gambar' };
  }
  if (file.size > 5 * 1024 * 1024) { // 5 MB
    return { ok: false, error: 'Ukuran file terlalu besar (max 5 MB)' };
  }
  return { ok: true };
}

const APP_NAME = 'Catatku';
const SCHEMA_VERSION = 1;

export type Settings = {
  display_name: string | null;
  timezone: string;
  theme_preference: 'system' | 'light' | 'dark';
};

export type ExportFile = {
  app: string;
  schema_version: number;
  exported_at: string;
  settings: Settings;
  events: ImportEvent[];
};

// Subset field Event yang aman dipindah antar instalasi (tanpa field internal server).
type ImportEvent = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  is_all_day: boolean;
  location?: string;
  category?: string;
  user_status: 'active' | 'completed' | 'cancelled';
  source_type: 'manual' | 'voice' | 'poster';
  date_label?: 'acara' | 'pendaftaran' | 'tenggat' | 'lainnya';
  daily_reminder_enabled: boolean;
  daily_reminder_time?: string;
  daily_window_days: number;
  pre_start_offset_minutes?: number;
  revision: number;
  created_at: string;
  updated_at: string;
};

export async function exportData(): Promise<string> {
  const { dbGetAll } = await import('./db');
  const events = await dbGetAll();

  const data: ExportFile = {
    app: APP_NAME,
    schema_version: SCHEMA_VERSION,
    exported_at: new Date().toISOString(),
    settings: {
      display_name: null,
      timezone: 'Asia/Jakarta',
      theme_preference: 'system',
    },
    events: events.map(({ deleted_at, ...rest }) => rest) as ImportEvent[],
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `catatku-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  return json;
}

export async function importData(file: File): Promise<{ imported: number; skipped: number }> {
  const { dbGetAll, dbPut } = await import('./db');
  const text = await file.text();

  let data: ExportFile;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Berkas tidak valid: bukan JSON yang dapat dibaca.');
  }

  if (
    data.app !== APP_NAME ||
    data.schema_version !== SCHEMA_VERSION ||
    !Array.isArray(data.events)
  ) {
    throw new Error('Versi skema tidak dikenali atau berkas bukan milik Catatku.');
  }

  const existing = (await dbGetAll()) as ImportEvent[];
  const byId = new Map(existing.map((e) => [e.id, e]));
  let imported = 0;
  let skipped = 0;

  for (const ev of data.events) {
    if (!ev.id || !ev.title || !ev.start_date) {
      skipped++;
      continue;
    }
    const cur = byId.get(ev.id);
    if (cur && cur.revision >= (ev.revision || 1)) {
      skipped++;
      continue;
    }

    const clean: ImportEvent = {
      id: ev.id,
      title: ev.title.trim(),
      description: ev.description || '',
      start_date: ev.start_date,
      start_time: ev.start_time || undefined,
      end_date: ev.end_date || undefined,
      end_time: ev.end_time || undefined,
      is_all_day: Boolean(ev.is_all_day),
      location: ev.location || undefined,
      category: ev.category || undefined,
      user_status: ev.user_status,
      source_type: ev.source_type || 'manual',
      date_label: ev.date_label || undefined,
      daily_reminder_enabled: Boolean(ev.daily_reminder_enabled),
      daily_reminder_time: ev.daily_reminder_time || undefined,
      daily_window_days: ev.daily_window_days || 7,
      pre_start_offset_minutes: ev.pre_start_offset_minutes || undefined,
      revision: ev.revision || 1,
      created_at: ev.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await dbPut(clean as never);
    imported++;
  }

  return { imported, skipped };
}

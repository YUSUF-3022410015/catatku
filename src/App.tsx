import React, { useEffect, useState } from 'react';
import { Event, dbGetAll, dbPut, dbDelete } from './db';
import { exportData, importData } from './exportImport';
import { setupNotifications } from './notificationSetup';

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [windowDays, setWindowDays] = useState(7);
  const [info, setInfo] = useState<{ msg: string; kind: 'ok' | 'err' } | null>(null);
  const [importing, setImporting] = useState(false);

  const dismissInfo = () => setInfo(null);

  const handleExport = async () => {
    try {
      await exportData();
      setInfo({ msg: 'Data diekspor.', kind: 'ok' });
    } catch (e) {
      setInfo({ msg: 'Gagal mengekspor: ' + (e as Error).message, kind: 'err' });
    }
  };

  const handleImport = async (file: File) => {
    setImporting(true);
    try {
      const result = await importData(file);
      await loadEvents();
      setInfo({ msg: `Diimpor: ${result.imported} kegiatan, ${result.skipped} dilewati.`, kind: 'ok' });
    } catch (e) {
      setInfo({ msg: 'Gagal mengimpor: ' + (e as Error).message, kind: 'err' });
    } finally {
      setImporting(false);
      (document.getElementById('importFile') as HTMLInputElement).value = '';
    }
  };

  useEffect(() => {
    loadEvents();
    applyTheme(theme);
  }, []);

  const applyTheme = (t: 'system' | 'light' | 'dark') => {
    setTheme(t);
    const root = document.documentElement;
    if (t === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', t);
    }
  };

  const loadEvents = async () => {
    const list = await dbGetAll();
    setEvents(list.filter(e => !e.deleted_at));
  };

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setTitle(event.title);
      setDescription(event.description || '');
      setStartDate(event.start_date);
      setStartTime(event.start_time || '');
      setIsAllDay(event.is_all_day);
      setLocation(event.location || '');
      setReminderEnabled(event.daily_reminder_enabled);
      setReminderTime(event.daily_reminder_time || '08:00');
      setWindowDays(event.daily_window_days || 7);
    } else {
      setEditingEvent(null);
      setTitle('');
      setDescription('');
      setStartDate(selectedDate);
      setStartTime('');
      setIsAllDay(false);
      setLocation('');
      setReminderEnabled(false);
      setReminderTime('08:00');
      setWindowDays(7);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    const now = new Date().toISOString();
    const eventData: Event = {
      id: editingEvent ? editingEvent.id : crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      start_date: startDate,
      start_time: isAllDay ? undefined : startTime || undefined,
      is_all_day: isAllDay,
      location: location.trim() || undefined,
      user_status: editingEvent ? editingEvent.user_status : 'active',
      source_type: editingEvent ? editingEvent.source_type : 'manual',
      daily_reminder_enabled: reminderEnabled,
      daily_reminder_time: reminderEnabled ? reminderTime : undefined,
      daily_window_days: windowDays,
      revision: editingEvent ? editingEvent.revision + 1 : 1,
      created_at: editingEvent ? editingEvent.created_at : now,
      updated_at: now,
    };

    await dbPut(eventData);
    setIsModalOpen(false);
    loadEvents();
  };

  const handleStatusChange = async (id: string, status: 'active' | 'completed' | 'cancelled') => {
    const event = events.find(e => e.id === id);
    if (!event) return;
    const updated: Event = {
      ...event,
      user_status: status,
      revision: event.revision + 1,
      updated_at: new Date().toISOString(),
    };
    await dbPut(updated);
    loadEvents();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus kegiatan ini?')) {
      await dbDelete(id);
      loadEvents();
    }
  };

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const getEventsForDate = (dateStr: string) => events.filter(e => e.start_date === dateStr);

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark transition-colors duration-200">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-accent-light dark:text-accent-dark">CatatKu</h1>
          <p className="text-xs opacity-60">Jadwal & Pengingat Pribadi</p>
        </div>
        <div className="flex gap-2 items-center">
          <select 
            value={theme} 
            onChange={(e) => applyTheme(e.target.value as any)}
            className="text-xs p-1 rounded bg-transparent border border-gray-300 dark:border-gray-700"
          >
            <option value="system" className="text-black">Tema: System</option>
            <option value="light" className="text-black">Tema: Light</option>
            <option value="dark" className="text-black">Tema: Dark</option>
          </select>
          <button
            onClick={handleExport}
            className="px-2 py-1 text-xs border rounded bg-transparent border-gray-300 dark:border-gray-700 hover:opacity-80"
          >
            Ekspor
          </button>
          <button
            onClick={() => document.getElementById('importFile')?.click()}
            disabled={importing}
            className="px-2 py-1 text-xs border rounded bg-transparent border-gray-300 dark:border-gray-700 hover:opacity-80"
          >
            Impor
          </button>
          <input
            id="importFile"
            type="file"
            accept=".json"
            hidden
            onChange={(e) => { if (e.target.files?.length) handleImport(e.target.files[0]); }}
          />
          <button
            onClick={async () => {
              const r = await setupNotifications();
              setInfo({ msg: r.msg, kind: r.ok ? 'ok' : 'err' });
            }}
            className="px-2 py-1 text-xs border rounded bg-transparent border-gray-300 dark:border-gray-700 hover:opacity-80"
          >
            Notifikasi
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-3 py-1.5 bg-accent-light dark:bg-accent-dark text-white dark:text-gray-900 text-sm font-medium rounded-lg shadow hover:opacity-90 transition"
          >
            + Tambah
          </button>
        </div>
      </header>

      {info && (
        <div className={`p-3 rounded-lg text-xs border ${info.kind === 'ok' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`} role="alert">
          {info.msg}
          <button onClick={dismissInfo} className="ml-2 underline font-medium">Tutup</button>
        </div>
      )}

      {/* Main Layout */}
      <main className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kalender Section (2 Cols) */}
        <section className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">{monthNames[month]} {year}</h2>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm hover:opacity-80">‹</button>
              <button onClick={() => setCurrentDate(new Date())} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs hover:opacity-80">Hari Ini</button>
              <button onClick={nextMonth} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm hover:opacity-80">›</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold opacity-60">
            <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-14 sm:h-20 bg-transparent rounded" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const dayEvents = getEventsForDate(dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-14 sm:h-20 p-1 border rounded-lg flex flex-col justify-between cursor-pointer transition ${
                    isSelected 
                      ? 'border-accent-light dark:border-accent-dark bg-accent-light/10 dark:bg-accent-dark/10' 
                      : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <span className={`text-xs font-medium ${isSelected ? 'font-bold text-accent-light dark:text-accent-dark' : ''}`}>
                    {d}
                  </span>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map(e => (
                      <span 
                        key={e.id} 
                        className={`text-[9px] px-1 rounded truncate ${
                          e.user_status === 'completed' 
                            ? 'line-through opacity-50 bg-gray-200 dark:bg-gray-700' 
                            : 'bg-accent-light/20 text-accent-light dark:bg-accent-dark/20 dark:text-accent-dark'
                        }`}
                      >
                        {e.title}
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[8px] opacity-60">+{dayEvents.length - 2} lagi</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Agenda Section (1 Col) */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-base">Agenda {selectedDate}</h3>
            <span className="text-xs opacity-60">{getEventsForDate(selectedDate).length} kegiatan</span>
          </div>

          <div className="space-y-2">
            {getEventsForDate(selectedDate).length === 0 ? (
              <p className="text-xs opacity-50 italic py-4 text-center">Tidak ada kegiatan di tanggal ini.</p>
            ) : (
              getEventsForDate(selectedDate).map(e => (
                <div 
                  key={e.id}
                  className="p-3 border border-gray-100 dark:border-gray-800 rounded-xl space-y-2 relative bg-white/5 backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-sm font-medium ${e.user_status === 'completed' ? 'line-through opacity-50' : ''}`}>
                      {e.title}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                      e.user_status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      e.user_status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {e.user_status}
                    </span>
                  </div>

                  {e.description && <p className="text-xs opacity-70">{e.description}</p>}
                  
                  <div className="text-[10px] opacity-60 flex gap-2">
                    {e.is_all_day ? <span>Sepanjang hari</span> : e.start_time ? <span>{e.start_time}</span> : null}
                    {e.location && <span>• {e.location}</span>}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800/50">
                    <div className="flex gap-1">
                      {e.user_status === 'active' && (
                        <button 
                          onClick={() => handleStatusChange(e.id, 'completed')}
                          className="text-[10px] text-green-600 hover:underline"
                        >
                          Selesai
                        </button>
                      )}
                      {e.user_status === 'active' && (
                        <button 
                          onClick={() => handleStatusChange(e.id, 'cancelled')}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenModal(e)}
                        className="text-[10px] opacity-70 hover:opacity-100"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(e.id)}
                        className="text-[10px] text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Modal Tambah/Edit Kegiatan */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 p-5 rounded-2xl max-w-sm w-full space-y-4">
            <h3 className="font-bold text-base">{editingEvent ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 opacity-70">Judul Kegiatan *</label>
                <input 
                  type="text" 
                  required
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-transparent border-gray-300 dark:border-gray-700"
                  placeholder="Mis. Rapat Tim"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 opacity-70">Tanggal *</label>
                  <input 
                    type="date" 
                    required
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-transparent border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block mb-1 opacity-70">Jam</label>
                  <input 
                    type="time" 
                    disabled={isAllDay}
                    value={startTime} 
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-transparent border-gray-300 dark:border-gray-700 disabled:opacity-30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="allDay" 
                  checked={isAllDay} 
                  onChange={e => setIsAllDay(e.target.checked)}
                />
                <label htmlFor="allDay">Sepanjang hari</label>
              </div>

              <div>
                <label className="block mb-1 opacity-70">Lokasi / Catatan</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-transparent border-gray-300 dark:border-gray-700"
                  placeholder="Opsional"
                />
              </div>

              {/* Pengingat Harian (Sesuai FR-11 & FR-12) */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl space-y-2 border border-gray-200 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Pengingat Harian</span>
                  <input 
                    type="checkbox" 
                    checked={reminderEnabled} 
                    onChange={e => setReminderEnabled(e.target.checked)}
                  />
                </div>
                {reminderEnabled && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block mb-0.5 opacity-60">Jam</label>
                      <input 
                        type="time" 
                        value={reminderTime} 
                        onChange={e => setReminderTime(e.target.value)}
                        className="w-full p-1 border rounded bg-transparent border-gray-300 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block mb-0.5 opacity-60">Jendela Hari</label>
                      <select 
                        value={windowDays} 
                        onChange={e => setWindowDays(Number(e.target.value))}
                        className="w-full p-1 border rounded bg-transparent border-gray-300 dark:border-gray-700"
                      >
                        <option value={3} className="text-black">3 hari terakhir</option>
                        <option value={7} className="text-black">7 hari terakhir</option>
                        <option value={14} className="text-black">14 hari terakhir</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg opacity-70 hover:opacity-100"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-3 py-1.5 bg-accent-light dark:bg-accent-dark text-white dark:text-gray-900 rounded-lg font-medium"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

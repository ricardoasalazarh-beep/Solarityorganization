'use client';

import { useState } from 'react';
import { PRIORITIES } from '../lib/areas';

export default function AddInitiativeForm({ area, onCreate, onClose }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('media');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onCreate({ area: area.id, title, notes, priority, dueDate: dueDate || null });
      setTitle('');
      setNotes('');
      setPriority('media');
      setDueDate('');
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2"
    >
      <textarea
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Escribe o dicta la iniciativa (usa el micrófono del teclado)…"
        rows={2}
        className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notas adicionales (opcional)"
        rows={2}
        className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <div className="flex flex-wrap gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-slate-300 p-2 text-sm"
        >
          {PRIORITIES.map((p) => (
            <option key={p.key} value={p.key}>
              Prioridad: {p.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border border-slate-300 p-2 text-sm"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {saving ? 'Guardando…' : 'Agregar'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

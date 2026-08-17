'use client';

import { useState } from 'react';
import { PRIORITIES, STATUSES } from '../lib/areas';

const PRIORITY_STYLES = {
  alta: 'bg-red-100 text-red-700 border-red-200',
  media: 'bg-amber-100 text-amber-700 border-amber-200',
  baja: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function InitiativeCard({ item, areas, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [notes, setNotes] = useState(item.notes || '');
  const [area, setArea] = useState(item.area);
  const [priority, setPriority] = useState(item.priority);
  const [dueDate, setDueDate] = useState(item.due_date ? item.due_date.slice(0, 10) : '');
  const [status, setStatus] = useState(item.status);
  const [saving, setSaving] = useState(false);

  const isDone = item.status === 'hecho';

  async function save() {
    setSaving(true);
    try {
      await onUpdate(item.id, { title, notes, area, priority, dueDate: dueDate || null, status });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function toggleDone() {
    await onUpdate(item.id, { status: isDone ? 'pendiente' : 'hecho' });
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-slate-300 bg-white p-3 space-y-2 shadow-sm">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Notas"
          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <select value={area} onChange={(e) => setArea(e.target.value)} className="rounded-lg border border-slate-300 p-2 text-sm">
            {areas.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-300 p-2 text-sm">
            {PRIORITIES.map((p) => (
              <option key={p.key} value={p.key}>Prioridad: {p.label}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-300 p-2 text-sm">
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-lg border border-slate-300 p-2 text-sm" />
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={save} disabled={saving} className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40">
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
          <button onClick={() => setEditing(false)} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">
            Cancelar
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="ml-auto rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-3 shadow-sm bg-white flex gap-3 ${isDone ? 'opacity-50' : ''}`}>
      <input
        type="checkbox"
        checked={isDone}
        onChange={toggleDone}
        className="mt-1 h-4 w-4 shrink-0 accent-slate-900"
      />
      <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setEditing(true)}>
        <p className={`text-sm font-medium leading-snug ${isDone ? 'line-through' : ''}`}>{item.title}</p>
        {item.notes ? <p className="mt-1 text-xs text-slate-500 whitespace-pre-wrap">{item.notes}</p> : null}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.media}`}>
            {PRIORITIES.find((p) => p.key === item.priority)?.label || item.priority}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
            {STATUSES.find((s) => s.key === item.status)?.label || item.status}
          </span>
          {item.due_date ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
              📅 {new Date(item.due_date).toLocaleDateString('es-CL')}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

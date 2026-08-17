'use client';

import { useState } from 'react';

export default function AddAreaForm({ onCreate, onClose }) {
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!label.trim()) return;
    setSaving(true);
    try {
      await onCreate({ label: label.trim() });
      setLabel('');
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full min-h-[140px] flex-col justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-4"
    >
      <input
        autoFocus
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Nombre de la nueva área…"
        className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving || !label.trim()}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {saving ? 'Creando…' : 'Crear área'}
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

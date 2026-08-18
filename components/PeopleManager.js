'use client';

import { useState } from 'react';

export default function PeopleManager({ people, onCreate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);
    try {
      await onCreate({ name, email });
      setName('');
      setEmail('');
      setOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo agregar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(person) {
    if (!window.confirm(`¿Quitar a ${person.name} del directorio? Las iniciativas que tenía asignadas quedarán sin responsable.`)) return;
    await onDelete(person.id);
  }

  return (
    <div className="mb-6 rounded-2xl bg-white/60 p-3 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Personas de Solarity:</span>
        {people.map((p) => (
          <span
            key={p.id}
            className="group flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
            title={p.email}
          >
            {p.name}
            <button
              onClick={() => handleDelete(p)}
              className="text-slate-300 group-hover:text-red-600"
              aria-label={`Quitar a ${p.name}`}
            >
              ✕
            </button>
          </span>
        ))}
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-xs text-slate-500 hover:border-slate-400 hover:text-slate-700"
          >
            + Agregar persona
          </button>
        ) : null}
      </div>

      {open ? (
        <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap items-center gap-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            className="rounded-lg border border-slate-300 p-1.5 text-sm"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@solarityenergia.com"
            type="email"
            className="rounded-lg border border-slate-300 p-1.5 text-sm"
          />
          <button
            type="submit"
            disabled={saving || !name.trim() || !email.trim()}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
          >
            {saving ? 'Guardando…' : 'Agregar'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
          >
            Cancelar
          </button>
          {errorMsg ? <span className="text-xs text-red-600 w-full">{errorMsg}</span> : null}
        </form>
      ) : null}
    </div>
  );
}

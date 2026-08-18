'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { PRIORITIES, STATUSES } from '../../../lib/areas';

export default function PublicResponsePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-4 py-16 text-center text-slate-400 text-sm">Cargando…</main>
      }
    >
      <PublicResponseContent />
    </Suspense>
  );
}

function PublicResponseContent() {
  const { token } = useParams();
  const searchParams = useSearchParams();
  const presetAction = searchParams.get('action'); // 'si' | 'no' | null

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(presetAction === 'si');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`/api/public/initiative/${token}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || 'Error');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/public/initiative/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed, comment }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Error');
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-red-600 text-sm">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center text-slate-400 text-sm">
        Cargando…
      </main>
    );
  }

  const { initiative, comments } = data;

  if (done) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-lg font-semibold text-slate-900">¡Gracias!</p>
          <p className="mt-2 text-sm text-slate-500">
            Tu respuesta quedó registrada en el dashboard de Alfonso.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-medium text-slate-400">{initiative.area_label}</p>
        <h1 className="mt-1 text-lg font-semibold text-slate-900">{initiative.title}</h1>
        {initiative.notes ? (
          <p className="mt-2 text-sm text-slate-500 whitespace-pre-wrap">{initiative.notes}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
            Prioridad: {PRIORITIES.find((p) => p.key === initiative.priority)?.label || initiative.priority}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
            {STATUSES.find((s) => s.key === initiative.status)?.label || initiative.status}
          </span>
          {initiative.due_date ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              📅 {new Date(initiative.due_date).toLocaleDateString('es-CL')}
            </span>
          ) : null}
        </div>

        {comments && comments.length > 0 ? (
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            {comments.map((c, idx) => (
              <div key={idx} className="text-xs">
                <span className="font-medium text-slate-700">{c.author}: </span>
                <span className="text-slate-500">{c.body}</span>
              </div>
            ))}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <p className="text-sm font-medium text-slate-800">¿Se realizó esta tarea?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCompleted(true)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium ${
                completed ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-200 text-slate-500'
              }`}
            >
              ✅ Sí
            </button>
            <button
              type="button"
              onClick={() => setCompleted(false)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium ${
                !completed ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 text-slate-500'
              }`}
            >
              ❌ No
            </button>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deja un comentario (opcional)…"
            rows={3}
            className="w-full rounded-lg border border-slate-300 p-2 text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {saving ? 'Enviando…' : 'Enviar respuesta'}
          </button>
        </form>
      </div>
    </main>
  );
}

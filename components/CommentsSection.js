'use client';

import { useState } from 'react';

export default function CommentsSection({ initiativeId, initialCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/initiatives/${initiativeId}/comments`);
      const data = await res.json();
      setComments(data.comments || []);
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && comments === null) load();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/initiatives/${initiativeId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: 'Alfonso', body: text.trim() }),
      });
      setText('');
      await load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        onClick={toggle}
        className="text-[11px] text-slate-400 hover:text-slate-600"
      >
        💬 {comments ? comments.length : initialCount} comentario{(comments ? comments.length : initialCount) === 1 ? '' : 's'}
      </button>

      {open ? (
        <div className="mt-2 space-y-2 rounded-lg bg-slate-50 p-2">
          {loading ? <p className="text-xs text-slate-400">Cargando…</p> : null}
          {comments && comments.length === 0 ? <p className="text-xs text-slate-400">Sin comentarios todavía.</p> : null}
          {(comments || []).map((c) => (
            <div key={c.id || `${c.author}-${c.created_at}`} className="text-xs">
              <span className="font-medium text-slate-700">{c.author}: </span>
              <span className="text-slate-500">{c.body}</span>
            </div>
          ))}
          <form onSubmit={handleSubmit} className="flex gap-1 pt-1">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe un comentario…"
              className="flex-1 rounded-lg border border-slate-300 p-1.5 text-xs"
            />
            <button
              type="submit"
              disabled={saving || !text.trim()}
              className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white disabled:opacity-40"
            >
              +
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

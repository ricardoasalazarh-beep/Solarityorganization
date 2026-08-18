'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';
import AddInitiativeForm from '../components/AddInitiativeForm';
import AddAreaForm from '../components/AddAreaForm';
import InitiativeCard from '../components/InitiativeCard';
import PeopleManager from '../components/PeopleManager';

export default function DashboardPage() {
  const {
    data: initiativesData,
    error: initiativesError,
    isLoading: initiativesLoading,
    mutate: mutateInitiatives,
  } = useSWR('/api/initiatives', fetcher, {
    refreshInterval: 8000, // auto-actualiza cada 8s (ej: si agregas desde el celular, aparece solo en el computador)
    revalidateOnFocus: true,
  });

  const {
    data: areasData,
    error: areasError,
    mutate: mutateAreas,
  } = useSWR('/api/areas', fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: true,
  });

  const {
    data: peopleData,
    mutate: mutatePeople,
  } = useSWR('/api/people', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  const areas = areasData?.areas || [];
  const people = peopleData?.people || [];
  const [openForm, setOpenForm] = useState(null); // id de área con formulario de iniciativa abierto
  const [addingArea, setAddingArea] = useState(false);
  const [hideDone, setHideDone] = useState(true);

  const grouped = useMemo(() => {
    const map = {};
    for (const item of initiativesData?.initiatives || []) {
      if (!map[item.area]) map[item.area] = [];
      map[item.area].push(item);
    }
    return map;
  }, [initiativesData]);

  async function createInitiative(payload) {
    const res = await fetch('/api/initiatives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('No se pudo crear');
    await mutateInitiatives();
  }

  async function updateInitiative(id, patch) {
    // Optimistic update para que se sienta instantáneo
    mutateInitiatives(
      (current) => ({
        initiatives: (current?.initiatives || []).map((it) =>
          it.id === id ? { ...it, ...patch, due_date: patch.dueDate !== undefined ? patch.dueDate : it.due_date } : it
        ),
      }),
      { revalidate: false }
    );
    const res = await fetch(`/api/initiatives/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error('No se pudo actualizar');
    await mutateInitiatives();
  }

  async function deleteInitiative(id) {
    mutateInitiatives(
      (current) => ({ initiatives: (current?.initiatives || []).filter((it) => it.id !== id) }),
      { revalidate: false }
    );
    await fetch(`/api/initiatives/${id}`, { method: 'DELETE' });
    await mutateInitiatives();
  }

  async function createArea(payload) {
    const res = await fetch('/api/areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('No se pudo crear el área');
    await mutateAreas();
  }

  async function deleteArea(area) {
    const count = (grouped[area.id] || []).length;
    const message =
      count > 0
        ? `¿Borrar el área "${area.label}"? Esto también borrará sus ${count} iniciativa(s). Esta acción no se puede deshacer.`
        : `¿Borrar el área "${area.label}"? Esta acción no se puede deshacer.`;
    if (!window.confirm(message)) return;

    await fetch(`/api/areas/${area.id}`, { method: 'DELETE' });
    await Promise.all([mutateAreas(), mutateInitiatives()]);
  }

  async function createPerson(payload) {
    const res = await fetch('/api/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'No se pudo agregar la persona');
    }
    await mutatePeople();
  }

  async function deletePerson(id) {
    await fetch(`/api/people/${id}`, { method: 'DELETE' });
    await Promise.all([mutatePeople(), mutateInitiatives()]);
  }

  const totalPending = (initiativesData?.initiatives || []).filter((i) => i.status !== 'hecho').length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Mis iniciativas</h1>
          <p className="text-sm text-slate-500">
            {initiativesLoading ? 'Cargando…' : `${totalPending} pendientes en total · se actualiza solo`}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} className="accent-slate-900" />
          Ocultar terminadas
        </label>
      </header>

      <PeopleManager people={people} onCreate={createPerson} onDelete={deletePerson} />

      {initiativesError || areasError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          No se pudo conectar a la base de datos. Revisa que la variable <code>DATABASE_URL</code> esté configurada.
          ({(initiativesError || areasError).message})
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => {
          const items = (grouped[area.id] || []).filter((it) => (hideDone ? it.status !== 'hecho' : true));
          return (
            <section key={area.id} className="rounded-2xl bg-white/60 p-3 shadow-sm ring-1 ring-slate-200">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: area.color }} />
                  <h2 className="text-sm font-semibold text-slate-800">{area.label}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{items.length}</span>
                  <button
                    onClick={() => deleteArea(area)}
                    title="Borrar área"
                    className="text-xs text-slate-300 hover:text-red-600"
                  >
                    🗑
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <InitiativeCard
                    key={item.id}
                    item={item}
                    areas={areas}
                    people={people}
                    onUpdate={updateInitiative}
                    onDelete={deleteInitiative}
                  />
                ))}
                {items.length === 0 ? <p className="text-xs text-slate-400 py-2">Sin pendientes</p> : null}
              </div>

              {openForm === area.id ? (
                <AddInitiativeForm area={area} people={people} onCreate={createInitiative} onClose={() => setOpenForm(null)} />
              ) : (
                <button
                  onClick={() => setOpenForm(area.id)}
                  className="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-2 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700"
                >
                  + Agregar iniciativa
                </button>
              )}
            </section>
          );
        })}

        {addingArea ? (
          <AddAreaForm onCreate={createArea} onClose={() => setAddingArea(false)} />
        ) : (
          <button
            onClick={() => setAddingArea(true)}
            className="flex min-h-[140px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700"
          >
            + Nueva área
          </button>
        )}
      </div>
    </main>
  );
}

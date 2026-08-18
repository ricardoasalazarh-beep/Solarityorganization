import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { sendAssignmentEmailForInitiative } from '../../../../lib/notifications';

export const dynamic = 'force-dynamic';

const ALLOWED_FIELDS = {
  area: 'area',
  title: 'title',
  notes: 'notes',
  priority: 'priority',
  status: 'status',
  dueDate: 'due_date',
  responsibleId: 'responsible_id',
};

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const sets = [];
    const values = [];
    let i = 1;

    for (const [key, column] of Object.entries(ALLOWED_FIELDS)) {
      if (key in body) {
        const isEmptyToNull = body[key] === '' && (key === 'dueDate' || key === 'responsibleId');
        sets.push(`${column} = $${i}`);
        values.push(isEmptyToNull ? null : body[key]);
        i += 1;
      }
    }

    if (sets.length === 0) {
      return NextResponse.json({ error: 'Nada que actualizar.' }, { status: 400 });
    }

    sets.push(`updated_at = now()`);
    values.push(id);

    const { rows } = await query(
      `UPDATE initiatives SET ${sets.join(', ')} WHERE id = $${i}
       RETURNING id, area, title, notes, priority, status, due_date, created_at, updated_at, responsible_id`,
      values
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No encontrado.' }, { status: 404 });
    }

    const updated = rows[0];

    // Si se acaba de asignar (o reasignar) un responsable y hay fecha límite,
    // le avisamos por correo con el detalle de la tarea.
    if ('responsibleId' in body && updated.responsible_id && updated.due_date) {
      sendAssignmentEmailForInitiative(id).catch((err) => console.error('[email] asignación falló:', err));
    }

    return NextResponse.json({ initiative: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = params;
    await query(`DELETE FROM initiatives WHERE id = $1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

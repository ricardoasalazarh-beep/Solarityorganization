import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { query, ensureSchema } from '../../../lib/db';
import { sendAssignmentEmailForInitiative } from '../../../lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSchema();
    const { rows } = await query(
      `SELECT i.id, i.area, i.title, i.notes, i.priority, i.status, i.due_date,
              i.created_at, i.updated_at, i.responsible_id, i.public_token,
              i.checkin_response, i.checkin_sent_at,
              p.name AS responsible_name, p.email AS responsible_email,
              (SELECT COUNT(*)::int FROM comments c WHERE c.initiative_id = i.id) AS comment_count
       FROM initiatives i
       LEFT JOIN people p ON p.id = i.responsible_id
       ORDER BY
         CASE i.status WHEN 'hecho' THEN 1 ELSE 0 END,
         CASE i.priority WHEN 'alta' THEN 0 WHEN 'media' THEN 1 ELSE 2 END,
         i.created_at DESC`
    );
    return NextResponse.json({ initiatives: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureSchema();
    const body = await request.json();
    const { area, title, notes = '', priority = 'media', dueDate = null, responsibleId = null } = body;

    if (!area) {
      return NextResponse.json({ error: 'Área inválida.' }, { status: 400 });
    }
    const { rows: areaRows } = await query(`SELECT 1 FROM areas WHERE id = $1`, [area]);
    if (areaRows.length === 0) {
      return NextResponse.json({ error: 'El área indicada no existe.' }, { status: 400 });
    }
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'El título es obligatorio.' }, { status: 400 });
    }

    let validResponsibleId = null;
    if (responsibleId) {
      const { rows: personRows } = await query(`SELECT 1 FROM people WHERE id = $1`, [responsibleId]);
      if (personRows.length > 0) validResponsibleId = responsibleId;
    }

    const id = nanoid(10);
    const publicToken = nanoid(24);
    const { rows } = await query(
      `INSERT INTO initiatives (id, area, title, notes, priority, status, due_date, responsible_id, public_token)
       VALUES ($1, $2, $3, $4, $5, 'pendiente', $6, $7, $8)
       RETURNING id, area, title, notes, priority, status, due_date, created_at, updated_at, responsible_id, public_token`,
      [id, area, title.trim(), notes, priority, dueDate || null, validResponsibleId, publicToken]
    );

    if (validResponsibleId && dueDate) {
      // No bloquea la respuesta si el correo falla (ej. falta configurar Resend).
      sendAssignmentEmailForInitiative(id).catch((err) => console.error('[email] asignación falló:', err));
    }

    return NextResponse.json({ initiative: rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

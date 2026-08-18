import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { query, ensureSchema } from '../../../../../lib/db';

export const dynamic = 'force-dynamic';

// Endpoints públicos (sin login) para que la persona responsable de una
// iniciativa pueda verla y responder desde el link que le llega por correo.
// Solo exponen los datos mínimos necesarios, nunca el listado completo.

export async function GET(_request, { params }) {
  try {
    await ensureSchema();
    const { token } = params;
    const { rows } = await query(
      `SELECT i.id, i.title, i.notes, i.priority, i.status, i.due_date, i.checkin_response,
              a.label AS area_label,
              p.name AS responsible_name
       FROM initiatives i
       JOIN areas a ON a.id = i.area
       LEFT JOIN people p ON p.id = i.responsible_id
       WHERE i.public_token = $1`,
      [token]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Link inválido o expirado.' }, { status: 404 });
    }

    const { rows: comments } = await query(
      `SELECT author, body, created_at FROM comments WHERE initiative_id = $1 ORDER BY created_at ASC`,
      [rows[0].id]
    );

    const { id, ...publicFields } = rows[0];
    return NextResponse.json({ initiative: publicFields, comments });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await ensureSchema();
    const { token } = params;
    const body = await request.json();
    const completed = body.completed === true;
    const comment = (body.comment || '').trim();

    const { rows } = await query(
      `SELECT i.id, p.name AS responsible_name
       FROM initiatives i
       LEFT JOIN people p ON p.id = i.responsible_id
       WHERE i.public_token = $1`,
      [token]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Link inválido o expirado.' }, { status: 404 });
    }
    const initiativeId = rows[0].id;
    const authorName = rows[0].responsible_name || 'Responsable';

    await query(
      `UPDATE initiatives
       SET status = CASE WHEN $2 THEN 'hecho' ELSE status END,
           checkin_response = $3,
           updated_at = now()
       WHERE id = $1`,
      [initiativeId, completed, completed ? 'si' : 'no']
    );

    if (comment) {
      await query(
        `INSERT INTO comments (id, initiative_id, author, body) VALUES ($1, $2, $3, $4)`,
        [nanoid(10), initiativeId, authorName, comment]
      );
    }

    return NextResponse.json({ ok: true, completed });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { query, ensureSchema } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSchema();
    const { rows } = await query(
      `SELECT id, area, title, notes, priority, status, due_date, created_at, updated_at
       FROM initiatives
       ORDER BY
         CASE status WHEN 'hecho' THEN 1 ELSE 0 END,
         CASE priority WHEN 'alta' THEN 0 WHEN 'media' THEN 1 ELSE 2 END,
         created_at DESC`
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
    const { area, title, notes = '', priority = 'media', dueDate = null } = body;

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

    const id = nanoid(10);
    const { rows } = await query(
      `INSERT INTO initiatives (id, area, title, notes, priority, status, due_date)
       VALUES ($1, $2, $3, $4, $5, 'pendiente', $6)
       RETURNING id, area, title, notes, priority, status, due_date, created_at, updated_at`,
      [id, area, title.trim(), notes, priority, dueDate || null]
    );
    return NextResponse.json({ initiative: rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

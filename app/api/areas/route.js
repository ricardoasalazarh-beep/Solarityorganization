import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { query, ensureSchema } from '../../../lib/db';
import { COLOR_PALETTE } from '../../../lib/areas';

export const dynamic = 'force-dynamic';

function slugify(label) {
  return (
    label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40) || 'area'
  );
}

export async function GET() {
  try {
    await ensureSchema();
    const { rows } = await query(
      `SELECT id, label, color, sort_order FROM areas ORDER BY sort_order ASC, created_at ASC`
    );
    return NextResponse.json({ areas: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureSchema();
    const body = await request.json();
    const label = (body.label || '').trim();
    if (!label) {
      return NextResponse.json({ error: 'El nombre del área es obligatorio.' }, { status: 400 });
    }

    const { rows: countRows } = await query(`SELECT COUNT(*)::int AS count FROM areas`);
    const color = body.color || COLOR_PALETTE[countRows[0].count % COLOR_PALETTE.length];

    let id = slugify(label);
    const { rows: existing } = await query(`SELECT 1 FROM areas WHERE id = $1`, [id]);
    if (existing.length > 0) {
      id = `${id}_${nanoid(4)}`;
    }

    const { rows: maxRows } = await query(`SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM areas`);
    const sortOrder = maxRows[0].next;

    const { rows } = await query(
      `INSERT INTO areas (id, label, color, sort_order) VALUES ($1, $2, $3, $4)
       RETURNING id, label, color, sort_order`,
      [id, label, color, sortOrder]
    );

    return NextResponse.json({ area: rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

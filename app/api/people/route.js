import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { query, ensureSchema } from '../../../lib/db';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  try {
    await ensureSchema();
    const { rows } = await query(`SELECT id, name, email FROM people ORDER BY name ASC`);
    return NextResponse.json({ people: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureSchema();
    const body = await request.json();
    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio.' }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 });
    }

    const id = nanoid(10);
    const { rows } = await query(
      `INSERT INTO people (id, name, email) VALUES ($1, $2, $3) RETURNING id, name, email`,
      [id, name, email]
    );
    return NextResponse.json({ person: rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

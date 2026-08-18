import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { query } from '../../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  try {
    const { id } = params;
    const { rows } = await query(
      `SELECT id, author, body, created_at FROM comments WHERE initiative_id = $1 ORDER BY created_at ASC`,
      [id]
    );
    return NextResponse.json({ comments: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const text = (body.body || '').trim();
    const author = (body.author || 'Alfonso').trim();

    if (!text) {
      return NextResponse.json({ error: 'El comentario no puede estar vacío.' }, { status: 400 });
    }

    const commentId = nanoid(10);
    const { rows } = await query(
      `INSERT INTO comments (id, initiative_id, author, body) VALUES ($1, $2, $3, $4)
       RETURNING id, author, body, created_at`,
      [commentId, id, author, text]
    );
    return NextResponse.json({ comment: rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

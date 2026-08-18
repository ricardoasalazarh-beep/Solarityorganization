import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function DELETE(_request, { params }) {
  try {
    const { id } = params;
    // Las iniciativas que tenían a esta persona como responsable quedan sin
    // responsable (ON DELETE SET NULL en la columna responsible_id).
    await query(`DELETE FROM people WHERE id = $1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

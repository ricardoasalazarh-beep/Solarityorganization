import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function DELETE(_request, { params }) {
  try {
    const { id } = params;

    const { rows: areaRows } = await query(`SELECT id FROM areas WHERE id = $1`, [id]);
    if (areaRows.length === 0) {
      return NextResponse.json({ error: 'Área no encontrada.' }, { status: 404 });
    }

    // Borra en cascada las iniciativas del área (se avisa antes en la UI).
    const { rowCount: deletedInitiatives } = await query(
      `DELETE FROM initiatives WHERE area = $1`,
      [id]
    );
    await query(`DELETE FROM areas WHERE id = $1`, [id]);

    return NextResponse.json({ ok: true, deletedInitiatives });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

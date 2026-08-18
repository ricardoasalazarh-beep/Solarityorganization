import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { query, ensureSchema } from '../../../../lib/db';
import { sendEmail } from '../../../../lib/email';
import { checkinEmailTemplate } from '../../../../lib/emailTemplates';

export const dynamic = 'force-dynamic';

// Vercel Cron llama este endpoint una vez al día (ver vercel.json) con
// Authorization: Bearer <CRON_SECRET>. Busca iniciativas cuya fecha límite es
// HOY, que no están marcadas como "hecho", y que todavía no recibieron el
// correo de check-in — y les manda a su responsable la pregunta "¿se hizo?".

function appUrl() {
  return (process.env.APP_URL || '').replace(/\/$/, '');
}

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
    }
  }

  try {
    await ensureSchema();

    const { rows } = await query(
      `SELECT i.id, i.title, i.due_date, i.public_token,
              a.label AS area_label,
              p.email AS responsible_email
       FROM initiatives i
       JOIN areas a ON a.id = i.area
       JOIN people p ON p.id = i.responsible_id
       WHERE i.due_date = CURRENT_DATE
         AND i.status != 'hecho'
         AND i.checkin_sent_at IS NULL
         AND p.email IS NOT NULL`
    );

    let sent = 0;
    const errors = [];

    for (const row of rows) {
      const token = row.public_token || nanoid(24);
      if (!row.public_token) {
        await query(`UPDATE initiatives SET public_token = $1 WHERE id = $2`, [token, row.id]);
      }

      const link = `${appUrl()}/r/${token}`;
      const { subject, html } = checkinEmailTemplate({
        title: row.title,
        areaLabel: row.area_label,
        dueDate: row.due_date,
        linkYes: `${link}?action=si`,
        linkNo: `${link}?action=no`,
      });

      const result = await sendEmail({ to: row.responsible_email, subject, html });
      if (result.ok || result.skipped) {
        sent += 1;
      } else {
        errors.push({ id: row.id, result });
      }
      // Se marca como enviado igual para no reintentar en bucle si el correo
      // sigue fallando por un problema de configuración persistente.
      await query(`UPDATE initiatives SET checkin_sent_at = now() WHERE id = $1`, [row.id]);
    }

    return NextResponse.json({ ok: true, candidates: rows.length, sent, errors });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

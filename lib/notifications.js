import { query } from './db';
import { sendEmail } from './email';
import { assignmentEmailTemplate } from './emailTemplates';

function appUrl() {
  return (process.env.APP_URL || '').replace(/\/$/, '');
}

// Envía el correo de asignación (título, área, prioridad, fecha límite) al
// responsable de una iniciativa, y marca cuándo se envió. Se llama al crear
// una iniciativa con responsable, o al asignarle/cambiarle el responsable.
export async function sendAssignmentEmailForInitiative(initiativeId) {
  const { rows } = await query(
    `SELECT i.id, i.title, i.notes, i.priority, i.due_date, i.public_token,
            a.label AS area_label,
            p.name AS responsible_name, p.email AS responsible_email
     FROM initiatives i
     JOIN areas a ON a.id = i.area
     LEFT JOIN people p ON p.id = i.responsible_id
     WHERE i.id = $1`,
    [initiativeId]
  );
  const row = rows[0];
  if (!row || !row.responsible_email) return { skipped: true };

  const link = `${appUrl()}/r/${row.public_token}`;
  const { subject, html } = assignmentEmailTemplate({
    title: row.title,
    areaLabel: row.area_label,
    priority: row.priority,
    dueDate: row.due_date,
    notes: row.notes,
    link,
  });

  const result = await sendEmail({ to: row.responsible_email, subject, html });
  await query(`UPDATE initiatives SET assignment_email_sent_at = now() WHERE id = $1`, [initiativeId]);
  return result;
}

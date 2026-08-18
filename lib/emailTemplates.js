import { PRIORITIES } from './areas';

const PRIORITY_LABEL = Object.fromEntries(PRIORITIES.map((p) => [p.key, p.label]));

function formatDate(dateStr) {
  if (!dateStr) return 'Sin fecha';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
}

function wrapper(innerHtml) {
  return `
  <div style="font-family: -apple-system, Segoe UI, Arial, sans-serif; max-width: 480px; margin: 0 auto; color:#0f172a;">
    <div style="background:#0f172a; padding:16px 20px; border-radius:12px 12px 0 0;">
      <span style="color:#f1f5f9; font-size:14px; font-weight:600;">Solarity · Mis Iniciativas</span>
    </div>
    <div style="border:1px solid #e2e8f0; border-top:none; border-radius:0 0 12px 12px; padding:20px;">
      ${innerHtml}
    </div>
    <p style="color:#94a3b8; font-size:11px; margin-top:12px;">
      Este correo se generó automáticamente desde el dashboard de iniciativas de Alfonso Salazar.
    </p>
  </div>`;
}

export function assignmentEmailTemplate({ title, areaLabel, priority, dueDate, notes, link }) {
  const subject = `Nueva tarea asignada: ${title}`;
  const html = wrapper(`
    <h2 style="font-size:16px; margin:0 0 8px;">Se te asignó una iniciativa</h2>
    <p style="font-size:15px; font-weight:600; margin:0 0 12px;">${title}</p>
    <table style="font-size:13px; color:#334155; width:100%; border-collapse:collapse;">
      <tr><td style="padding:4px 0; color:#64748b;">Área</td><td style="padding:4px 0;">${areaLabel}</td></tr>
      <tr><td style="padding:4px 0; color:#64748b;">Prioridad</td><td style="padding:4px 0;">${PRIORITY_LABEL[priority] || priority}</td></tr>
      <tr><td style="padding:4px 0; color:#64748b;">Fecha límite</td><td style="padding:4px 0;">${formatDate(dueDate)}</td></tr>
    </table>
    ${notes ? `<p style="font-size:13px; color:#475569; margin-top:12px; white-space:pre-wrap;">${notes}</p>` : ''}
    <a href="${link}" style="display:inline-block; margin-top:16px; background:#0f172a; color:#fff; text-decoration:none; padding:10px 16px; border-radius:8px; font-size:13px; font-weight:600;">
      Ver detalle y comentar
    </a>
  `);
  return { subject, html };
}

export function checkinEmailTemplate({ title, areaLabel, dueDate, linkYes, linkNo }) {
  const subject = `¿Se completó? "${title}" vence hoy`;
  const html = wrapper(`
    <h2 style="font-size:16px; margin:0 0 8px;">Check-in de fecha límite</h2>
    <p style="font-size:15px; font-weight:600; margin:0 0 4px;">${title}</p>
    <p style="font-size:13px; color:#64748b; margin:0 0 16px;">${areaLabel} · vencía hoy (${formatDate(dueDate)})</p>
    <p style="font-size:13px; color:#334155; margin-bottom:16px;">¿Se realizó esta tarea?</p>
    <div>
      <a href="${linkYes}" style="display:inline-block; margin-right:8px; background:#16a34a; color:#fff; text-decoration:none; padding:10px 16px; border-radius:8px; font-size:13px; font-weight:600;">
        ✅ Sí, se completó
      </a>
      <a href="${linkNo}" style="display:inline-block; background:#dc2626; color:#fff; text-decoration:none; padding:10px 16px; border-radius:8px; font-size:13px; font-weight:600;">
        ❌ Aún no
      </a>
    </div>
    <p style="font-size:12px; color:#94a3b8; margin-top:16px;">Al hacer clic podrás además dejar un comentario antes de confirmar.</p>
  `);
  return { subject, html };
}

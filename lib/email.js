// Envío de correo vía Resend (https://resend.com). Usa fetch directo a su API
// REST para no agregar una dependencia extra.
//
// Variables de entorno relevantes (ver .env.example):
// - RESEND_API_KEY: API key de Resend. Si falta, el envío se omite (y queda
//   registrado en los logs) para no romper el resto de la app en desarrollo.
// - EMAIL_FROM: remitente, ej. "Iniciativas Solarity <onboarding@resend.dev>".
// - EMAIL_REPLY_TO: a quién le llegan las respuestas si alguien responde el
//   correo directamente (normalmente el correo de Outlook de Alfonso).

export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Iniciativas Solarity <onboarding@resend.dev>';
  const replyTo = process.env.EMAIL_REPLY_TO;

  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY no configurada. Se omitió el envío a ${to}: "${subject}"`);
    return { skipped: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[email] Resend respondió ${res.status} al enviar a ${to}: ${text}`);
      return { ok: false, status: res.status };
    }
    return { ok: true };
  } catch (err) {
    console.error(`[email] Error de red enviando a ${to}:`, err);
    return { ok: false, error: err.message };
  }
}

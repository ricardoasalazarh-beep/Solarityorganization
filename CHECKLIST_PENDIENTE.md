# Checklist para dejar solarityorganization.vercel.app al día

Archivo de referencia rápida. El detalle paso a paso completo está en
`DEPLOY.md` (dentro del mismo zip) — esto es solo el resumen accionable.

## 1. Actualizar el código (GitHub)
- [ ] Ir a tu repositorio en GitHub.
- [ ] "Add file" → "Upload files".
- [ ] Arrastrar **todo el contenido** de la carpeta `dashboard-solarity` de este
      zip (no la carpeta en sí, sino lo que está adentro: `app/`, `components/`,
      `lib/`, `package.json`, `vercel.json`, etc.).
- [ ] Confirmar el commit ("Commit changes").
- No necesitas borrar nada primero: los archivos con el mismo nombre se
  reemplazan solos, y los nuevos (`vercel.json`, `app/api/people/`, etc.) se
  agregan. Tus datos (iniciativas, áreas) están en la base de datos, no en
  estos archivos, así que no se tocan.

## 2. Confirmar que Vercel se redespliegue
- [ ] Entra a tu proyecto en Vercel → pestaña **Deployments**.
- [ ] Debería aparecer un deployment nuevo corriendo solo (por el push a GitHub).
- [ ] Si no aparece en 1-2 minutos, dale click a **Redeploy** en el último manualmente.

## 3. Crear cuenta de Resend (para que los correos funcionen)
- [ ] Ir a https://resend.com/signup y crear cuenta (puede ser con tu Outlook).
- [ ] Dentro de Resend: **API Keys** → **Create API Key** → copiar el valor
      (empieza con `re_...`). Guárdalo, no se vuelve a mostrar completo.

## 4. Variables de entorno en Vercel
Ir a tu proyecto → **Settings → Environment Variables** y agregar estas 5:

| Variable | Valor |
|---|---|
| `RESEND_API_KEY` | la key que copiaste de Resend |
| `EMAIL_FROM` | `Iniciativas Solarity <onboarding@resend.dev>` |
| `EMAIL_REPLY_TO` | `alfonso.salazar@solarityenergia.com` |
| `APP_URL` | `https://solarityorganization.vercel.app` |
| `CRON_SECRET` | cualquier texto largo al azar que inventes |

(`DATABASE_URL` ya debería estar configurada de antes — no la toques.)

- [ ] Guardar cada variable.
- [ ] Ir a **Deployments** → **Redeploy** en el último, para que tome las
      variables nuevas.

## 5. Verificar que todo quedó bien
- [ ] Abrir `https://solarityorganization.vercel.app/` — tus áreas e
      iniciativas de antes deben seguir ahí.
- [ ] Debe aparecer una barra nueva **"Personas de Solarity"** arriba del todo.
- [ ] Agregar una persona de prueba (nombre + tu propio correo) y asignarle una
      iniciativa con fecha de hoy — deberías recibir el correo de asignación en
      unos segundos (revisa spam la primera vez, por el remitente genérico de
      Resend).
- [ ] El check-in diario por fecha límite corre solo, no requiere que hagas nada.

## Si algo falla
- Si el dashboard muestra un error de conexión a base de datos: revisa que
  `DATABASE_URL` siga configurada en Vercel (no debería haber cambiado).
- Si no llegan los correos: revisa spam, y que `RESEND_API_KEY` esté bien
  copiada (sin espacios) en Vercel.
- Cualquier error, mándame una captura de pantalla y lo revisamos.

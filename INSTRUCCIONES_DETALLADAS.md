# Instrucciones detalladas — actualizar solarityorganization.vercel.app

Sigue esto en orden. Cada paso indica exactamente dónde hacer clic. Si algo no
se ve igual (Vercel y GitHub cambian su interfaz de vez en cuando), mándame una
captura y te digo dónde queda.

---

## PASO 1 — Subir el código nuevo a GitHub

1. Descomprime el archivo `dashboard-solarity.zip` que te mandé en tu
   computador (doble clic, o clic derecho → "Extraer todo" en Windows / doble
   clic en Mac). Va a quedar una carpeta llamada `dashboard-solarity`.

2. Abre tu navegador y entra a **github.com**, inicia sesión, y ve al
   repositorio donde subiste el proyecto la primera vez (el que usaste para
   conectar con Vercel).

3. Dentro del repositorio, busca el botón **"Add file"** (está arriba a la
   derecha, cerca de un botón verde que dice "Code"). Haz clic ahí y elige
   **"Upload files"**.

4. Se abre una pantalla con un recuadro punteado que dice algo como "Drag
   files here to add them to your repository". Ahora:
   - Abre la carpeta `dashboard-solarity` que descomprimiste en el paso 1.
   - Selecciona **todo lo que está adentro** (los archivos y carpetas: `app`,
     `components`, `lib`, `public`, `scripts`, `package.json`, `vercel.json`,
     `next.config.js`, `tailwind.config.js`, `postcss.config.js`,
     `.env.example`, `.gitignore`, `DEPLOY.md`, `CHECKLIST_PENDIENTE.md`).
     — **Ojo:** selecciona el *contenido* de la carpeta, no la carpeta
     `dashboard-solarity` en sí (si arrastras la carpeta completa, GitHub la
     va a meter como una subcarpeta y se rompe la estructura).
   - Arrástralos todos juntos hacia el recuadro punteado de GitHub.

5. Espera a que termine de cargar (la barra de progreso desaparece cuando
   termina, puede tardar 10-30 segundos).

6. Baja hasta el final de la página. Vas a ver un cuadro de texto que dice
   "Commit changes" con un campo para escribir un mensaje. Escribe algo como
   `Actualización: responsables, correos y check-in` y haz clic en el botón
   verde **"Commit changes"**.

7. Listo — el código ya quedó en GitHub. Tus archivos viejos con el mismo
   nombre se reemplazaron solos; los nuevos (como `vercel.json` o la carpeta
   `app/api/people`) se agregaron sin borrar nada de lo que ya tenías.

---

## PASO 2 — Confirmar que Vercel se actualice

1. Entra a **vercel.com**, inicia sesión, y entra a tu proyecto (el que se
   llama algo como `solarityorganization` o `mis-iniciativas`).

2. Ve a la pestaña **"Deployments"** (arriba, junto a "Overview", "Storage",
   etc.).

3. Como acabas de subir un commit a GitHub, debería aparecer automáticamente
   un deployment nuevo en la lista, con un ícono girando (building) y después
   un ✓ verde cuando termine (tarda 1-2 minutos).

4. Si después de 2-3 minutos no ves nada nuevo en la lista, haz esto:
   - Busca el deployment más reciente (el de arriba de todo).
   - Haz clic en los tres puntitos **"⋯"** al lado derecho de esa fila.
   - Elige **"Redeploy"**.
   - Confirma en el cuadro que aparece.

**No sigas al paso 3 todavía si quieres, pero tampoco pasa nada si el
deployment falla ahora** — es esperable que falle o que la página se vea con
errores hasta que agregues las variables de entorno del paso 4. Eso lo
arreglamos ahí.

---

## PASO 3 — Crear tu cuenta de Resend (para que salgan los correos)

1. Ve a **resend.com/signup**.

2. Puedes crear la cuenta con tu correo de Outlook
   (`alfonso.salazar@solarityenergia.com`) y una contraseña, o con "Continue
   with Google" si tienes Gmail. Cualquiera funciona igual.

3. Confirma tu correo si te piden verificarlo (revisa tu bandeja de entrada,
   puede llegar a spam la primera vez).

4. Una vez adentro del panel de Resend, en el menú de la izquierda busca
   **"API Keys"**.

5. Haz clic en **"Create API Key"**:
   - Nombre: puedes poner `dashboard-iniciativas` (o cualquier nombre, es solo
     para identificarla).
   - Permission: deja la opción por defecto (**"Full access"** o **"Sending
     access"**, cualquiera de las dos sirve).
   - Haz clic en **"Add"** / **"Create"**.

6. Te va a mostrar la key completa **una sola vez**, algo como
   `re_AbCdEfGh123456...`. Cópiala ahora mismo (botón de copiar al lado) y
   pégala en un lugar temporal (un Notas, un correo borrador) — si cierras esa
   ventana sin copiarla, tendrás que crear una nueva.

---

## PASO 4 — Agregar las variables de entorno en Vercel

1. En Vercel, dentro de tu proyecto, ve a **"Settings"** (pestaña arriba).

2. En el menú de la izquierda, haz clic en **"Environment Variables"**.

3. Vas a ver que ya existe una variable `DATABASE_URL` (o `POSTGRES_URL`) de
   cuando conectaste la base de datos — **no la toques, no la borres**.

4. Ahora agrega, una por una, estas 5 variables nuevas. Para cada una:
   escribes el nombre en el campo "Key", el valor en el campo "Value", dejas
   marcados los 3 ambientes (Production, Preview, Development) y haces clic en
   **"Add"** (o "Save").

   | Key (nombre exacto) | Value (valor) |
   |---|---|
   | `RESEND_API_KEY` | La key que copiaste en el Paso 3 (`re_...`) |
   | `EMAIL_FROM` | `Iniciativas Solarity <onboarding@resend.dev>` |
   | `EMAIL_REPLY_TO` | `alfonso.salazar@solarityenergia.com` |
   | `APP_URL` | `https://solarityorganization.vercel.app` |
   | `CRON_SECRET` | Cualquier texto largo y random, ej: `sol4r1ty-ch3ck1n-2026-x7q9` |

   Para `CRON_SECRET` no importa qué texto pongas, solo que sea largo y que no
   se lo digas a nadie — es como una contraseña interna entre Vercel y tu app.

5. Cuando termines de agregar las 5, vuelve a la pestaña **"Deployments"**.

6. En el deployment más reciente, clic en **"⋯"** → **"Redeploy"** → confirma.
   Espera el ✓ verde (1-2 minutos).

---

## PASO 5 — Verificar que todo funciona

1. Abre `https://solarityorganization.vercel.app/` en una pestaña nueva.

2. Confirma que tus áreas e iniciativas de antes siguen todas ahí, tal como
   las dejaste.

3. Arriba del todo debería aparecer una barra nueva que dice **"Personas de
   Solarity"** con un botón "+ Agregar persona".

4. Haz una prueba completa:
   - Agrega una persona con **tu propio correo** (para probar sin molestar a
     nadie más), ej: nombre "Prueba", correo el tuyo.
   - Ve a cualquier iniciativa (o crea una nueva), asígnale esa persona como
     responsable, y ponle **la fecha de hoy** como fecha límite.
   - En unos segundos debería llegarte un correo de asignación a esa
     dirección (revisa spam/promociones la primera vez — como el remitente es
     `onboarding@resend.dev`, algunos clientes de correo lo marcan como
     sospechoso al principio).
   - El check-in diario ("¿se completó?") se dispara solo, automáticamente,
     una vez al día — no hace falta que hagas nada para activarlo, ya viene
     configurado en `vercel.json`.

5. Si el correo no llega después de 5 minutos:
   - Ve a Resend → menú **"Emails"** o **"Logs"** — ahí deberías ver el
     intento de envío y si falló, por qué.
   - Revisa que copiaste bien la `RESEND_API_KEY` en Vercel (sin espacios de
     más al principio o al final).

---

## Si algo se ve roto

- **"No se pudo conectar a la base de datos"** en la app: la variable
  `DATABASE_URL` se debe haber perdido o cambiado — revisa en Vercel Settings
  → Environment Variables que siga ahí. No debería haber pasado con estos
  cambios.
- **La página se ve en blanco o da error 500**: ve a Vercel → Deployments →
  clic en el deployment con la ❌ roja → pestaña "Logs" o "Build Logs" — copia
  el error y mándamelo, lo reviso contigo.
- **Cualquier otra cosa rara**: una captura de pantalla del problema (y en qué
  paso ocurrió) es lo más rápido para que te ayude.

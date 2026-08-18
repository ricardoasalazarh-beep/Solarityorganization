# Cómo publicar tu dashboard de iniciativas

Esta app es un proyecto **Next.js** con una base de datos **Postgres**. La guía de abajo usa
**GitHub + Vercel**, que es gratis para uso personal y no requiere instalar nada
si usas la web de GitHub para subir los archivos.

## 1. Sube el código a GitHub

1. Entra a https://github.com/new y crea un repositorio (por ejemplo `mis-iniciativas`),
   privado.
2. En la página del repo recién creado, usa la opción **"uploading an existing file"**
   y arrastra **todos los archivos y carpetas** de esta carpeta (`dashboard-solarity`)
   excepto `node_modules` (no debería existir, pero por si acaso).
   - Alternativa con git desde tu computador:
     ```bash
     cd dashboard-solarity
     git init
     git add .
     git commit -m "Dashboard inicial"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/mis-iniciativas.git
     git push -u origin main
     ```

## 2. Crea una cuenta en Vercel e importa el proyecto

1. Ve a https://vercel.com/signup y crea una cuenta (puedes usar tu cuenta de GitHub
   para entrar directo).
2. Click en **"Add New" → "Project"**.
3. Elige el repositorio `mis-iniciativas` que acabas de subir y click en **Import**.
4. Deja la configuración por defecto (Vercel detecta Next.js automáticamente) y
   click en **Deploy**. La primera vez va a fallar o quedar en blanco porque falta
   la base de datos — eso lo arreglamos en el siguiente paso.

## 3. Agrega la base de datos (Postgres)

1. Dentro del proyecto en Vercel, ve a la pestaña **Storage**.
2. Click en **Create Database** → elige **Postgres** (Neon, integrado con Vercel).
3. Sigue el asistente y conecta la base de datos a tu proyecto. Vercel configura
   automáticamente la variable de entorno `DATABASE_URL` (o `POSTGRES_URL`) por ti.
4. Ve a **Deployments** y click en **Redeploy** en el último deployment para que
   tome la variable nueva.

La primera vez que la app reciba una petición, crea sola la tabla que necesita
(no hay que correr ningún script a mano).

## 4. Activa los correos automáticos (responsables, asignación y check-in)

Los correos de "se te asignó esta tarea" y "¿se completó?" se envían con
**Resend** (gratis hasta 3.000 correos/mes). Como no tienes cuenta de ningún
proveedor todavía, y por ahora no vamos a pedirle nada a TI, los correos van a
salir desde un remitente genérico de prueba — pero las respuestas (si alguien
contesta el correo directamente) van a llegar a tu Outlook.

1. Crea una cuenta gratis en https://resend.com/signup (con tu correo de Outlook
   está bien).
2. Dentro de Resend, ve a **API Keys** → **Create API Key** → cópiala (empieza
   con `re_...`).
3. En Vercel, ve a tu proyecto → **Settings → Environment Variables** y agrega:
   - `RESEND_API_KEY` = la key que copiaste.
   - `EMAIL_FROM` = `Iniciativas Solarity <onboarding@resend.dev>` (remitente de
     prueba de Resend; se ve genérico pero funciona).
   - `EMAIL_REPLY_TO` = `alfonso.salazar@solarityenergia.com` (para que si alguien
     responde el correo, te llegue a ti).
   - `APP_URL` = la URL de tu app en Vercel, ej. `https://mis-iniciativas.vercel.app`
     (sin `/` al final). La necesitas para que los links de los correos funcionen.
   - `CRON_SECRET` = cualquier texto largo al azar que inventes (ej. genera uno en
     https://1password.com/password-generator/). Protege el endpoint que revisa
     las fechas límite todos los días.
4. Ve a **Deployments** → **Redeploy** para que tome las variables nuevas.

> **Nota sobre el remitente genérico:** mientras no verifiques el dominio
> `solarityenergia.com` en Resend, los correos llegarán como
> `onboarding@resend.dev` (a veces cae en spam la primera vez). Si más adelante
> consigues que alguien de TI agregue un registro DNS al dominio, avísame y
> cambiamos `EMAIL_FROM` para que salga como `@solarityenergia.com`.

### El check-in diario de fecha límite

`vercel.json` ya incluye una tarea programada (**Vercel Cron**) que corre todos
los días a las 13:00 UTC (≈ 9:00–10:00 hora de Chile, según horario de verano)
y revisa qué iniciativas vencen hoy. Por cada una que tenga responsable y no
esté marcada como "hecho", le manda un correo preguntando "¿se completó?" con
botones Sí/No y espacio para comentar — la respuesta se refleja sola en tu
dashboard. No necesitas hacer nada más para activarlo: se activa solo al
desplegar en Vercel (plan Hobby permite 1 cron job diario, que es justo lo que
usamos).

Si quieres cambiar el horario, edita el campo `"schedule"` en `vercel.json`
(formato cron, en hora UTC) y vuelve a desplegar.

## 5. Abre tu dashboard

Vercel te da una URL tipo `https://mis-iniciativas.vercel.app`. Ábrela desde tu
celular y tu computador — es la misma base de datos, así que lo que agregues en
uno aparece en el otro (se actualiza solo cada pocos segundos, o al volver a la
pestaña).

### Agregarla a la pantalla de inicio del celular (para que se sienta como app)
- **iPhone (Safari):** abre la URL → botón compartir → "Agregar a pantalla de inicio".
- **Android (Chrome):** abre la URL → menú (⋮) → "Agregar a pantalla principal".

### Responsables y comentarios
Arriba del dashboard hay una barra "Personas de Solarity" donde agregas una vez
a cada persona (nombre + correo) y luego las eliges como responsable al crear o
editar cualquier iniciativa (necesitas ponerle también una fecha límite para
que el correo de asignación se dispare). Cada tarjeta tiene además un
contador de comentarios (💬) donde tú puedes dejar notas, y donde también
aparecen los comentarios que la persona responsable deje al responder el
correo de check-in.

### Notas de voz
No hace falta ninguna configuración especial: al escribir en el campo de texto
("Escribe o dicta la iniciativa…") puedes usar el micrófono del teclado de tu
celular (o el dictado por voz de Windows/Mac en el computador) para dictar en
vez de tipear.

## 6. (Opcional) Privacidad

Elegiste dejar la URL sin login. Igual te recomiendo:
- No compartas el link de `vercel.app` en canales públicos.
- Si más adelante quieres una contraseña simple, se puede agregar fácilmente
  con "Vercel Password Protection" (plan Pro) o un middleware propio — avísame
  y lo agrego.

## Probar en tu computador antes de publicar (opcional)

Necesitas Node.js instalado y una base de datos Postgres (puedes crear una
gratis en https://neon.tech en 1 minuto).

```bash
cd dashboard-solarity
npm install
cp .env.example .env.local   # y pega ahí tu DATABASE_URL
npm run dev
```

Abre http://localhost:3000

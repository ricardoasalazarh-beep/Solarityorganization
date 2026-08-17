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

## 4. Abre tu dashboard

Vercel te da una URL tipo `https://mis-iniciativas.vercel.app`. Ábrela desde tu
celular y tu computador — es la misma base de datos, así que lo que agregues en
uno aparece en el otro (se actualiza solo cada pocos segundos, o al volver a la
pestaña).

### Agregarla a la pantalla de inicio del celular (para que se sienta como app)
- **iPhone (Safari):** abre la URL → botón compartir → "Agregar a pantalla de inicio".
- **Android (Chrome):** abre la URL → menú (⋮) → "Agregar a pantalla principal".

### Notas de voz
No hace falta ninguna configuración especial: al escribir en el campo de texto
("Escribe o dicta la iniciativa…") puedes usar el micrófono del teclado de tu
celular (o el dictado por voz de Windows/Mac en el computador) para dictar en
vez de tipear.

## 5. (Opcional) Privacidad

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

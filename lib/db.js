import { Pool } from 'pg';
import { DEFAULT_AREAS } from './areas';

// Funciona con cualquier Postgres compatible con connection string:
// Vercel Postgres, Neon, Supabase, Railway, etc.
// En local (desarrollo) también funciona apuntando a un Postgres propio.

let pool;

function getPool() {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL;

    if (!connectionString) {
      throw new Error(
        'Falta la variable de entorno DATABASE_URL (o POSTGRES_URL). Configúrala en Vercel > Settings > Environment Variables.'
      );
    }

    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query(text, params) {
  const client = getPool();
  return client.query(text, params);
}

let schemaReady = false;

export async function ensureSchema() {
  if (schemaReady) return;

  await query(`
    CREATE TABLE IF NOT EXISTS areas (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#64748b',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS initiatives (
      id TEXT PRIMARY KEY,
      area TEXT NOT NULL,
      title TEXT NOT NULL,
      notes TEXT DEFAULT '',
      priority TEXT NOT NULL DEFAULT 'media',
      status TEXT NOT NULL DEFAULT 'pendiente',
      due_date DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // Siembra las áreas por defecto solo la primera vez (tabla vacía).
  const { rows } = await query(`SELECT COUNT(*)::int AS count FROM areas`);
  if (rows[0].count === 0) {
    for (let i = 0; i < DEFAULT_AREAS.length; i += 1) {
      const a = DEFAULT_AREAS[i];
      await query(
        `INSERT INTO areas (id, label, color, sort_order) VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [a.id, a.label, a.color, i]
      );
    }
  }

  schemaReady = true;
}

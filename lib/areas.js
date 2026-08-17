// Las áreas ahora viven en la tabla `areas` de la base de datos (se pueden
// agregar/borrar desde la UI). Esta lista solo se usa una vez, para poblar
// la base de datos la primera vez que la app corre (ver lib/db.js).

export const DEFAULT_AREAS = [
  { id: 'equipo_ventas', label: 'Equipo de ventas', color: '#2563eb' },
  { id: 'pipeline', label: 'Pipeline', color: '#7c3aed' },
  { id: 'herramientas', label: 'Herramientas', color: '#0891b2' },
  { id: 'pendientes_internos', label: 'Pendientes internos Solarity', color: '#ca8a04' },
  { id: 'brookfield', label: 'Update comercial y Brookfield', color: '#dc2626' },
  { id: 'almacenamiento', label: 'Almacenamiento', color: '#16a34a' },
  { id: 'alianzas', label: 'Alianzas estratégicas', color: '#db2777' },
];

// Paleta para asignar color automáticamente a áreas nuevas creadas desde la UI.
export const COLOR_PALETTE = [
  '#2563eb', '#7c3aed', '#0891b2', '#ca8a04', '#dc2626',
  '#16a34a', '#db2777', '#4f46e5', '#0d9488', '#ea580c',
];

export const PRIORITIES = [
  { key: 'alta', label: 'Alta' },
  { key: 'media', label: 'Media' },
  { key: 'baja', label: 'Baja' },
];

export const STATUSES = [
  { key: 'pendiente', label: 'Pendiente' },
  { key: 'en_progreso', label: 'En progreso' },
  { key: 'hecho', label: 'Hecho' },
];

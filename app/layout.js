import './globals.css';

export const metadata = {
  title: 'Mis Iniciativas — Solarity',
  description: 'Dashboard personal de iniciativas por área',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-100 text-slate-900 min-h-screen">{children}</body>
    </html>
  );
}

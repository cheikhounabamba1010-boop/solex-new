import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import 'dotenv/config';
import { db } from './server/db';
import { apiRouter } from './server/routes';

async function startServer() {
  await db.init();
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '35mb' }));
  app.use(express.urlencoded({ extended: true, limit: '35mb' }));

  // Mount uploaded images statically for both dev and prod
  const uploadsPath = path.resolve(process.cwd(), 'public/uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Mount API endpoints
  app.use('/api', apiRouter);

  // Unknown /api routes must answer JSON (never an HTML page)
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Route API introuvable.' }));

  // Health check (used by Render / uptime pingers)
  app.get('/healthz', (_req, res) => res.send('ok'));

  if (isProd) {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Mount Vite dev server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SOLEX Server] Ready on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SOLEX Server] Failed to start:', err);
  process.exit(1);
});

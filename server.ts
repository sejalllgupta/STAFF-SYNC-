import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './server/routes/authRoutes';
import userRoutes from './server/routes/userRoutes';
import attendanceRoutes from './server/routes/attendanceRoutes';
import leaveRoutes from './server/routes/leaveRoutes';
import announcementRoutes from './server/routes/announcementRoutes';
import trainingRoutes from './server/routes/trainingRoutes';
import performanceRoutes from './server/routes/performanceRoutes';
import reportRoutes from './server/routes/reportRoutes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers for API requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'StaffSync HRMS API Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Vite dev server mounting or static dist serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StaffSync MERN Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

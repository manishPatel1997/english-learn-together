import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import contentRouter from './routes/content';
import userRouter from './routes/user';
import settingsRouter from './routes/settings';
import adminRouter from './routes/admin';
import notificationsRouter from './routes/notifications';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Universal CORS configuration supporting localhost:3000, Vercel, and mobile/network IPs
app.use(
  cors({
    origin: true, // Echoes back requesting origin (localhost:3000, etc.)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Explicit preflight handling and fallback headers for maximum browser compatibility
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/content', contentRouter);
app.use('/api/user', userRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/notifications', notificationsRouter);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'English Learn Together API',
    time: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// Root welcome route
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>English Learn Together API Server</h1><p>Status: Active 🚀</p>');
});

// Start Server if executing directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`=================================`);
  });
}

export default app;

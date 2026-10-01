import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRouter from './routers/authRouter';
import vehicleRouter from './routers/vehicleRouter';
import serviceRouter from './routers/serviceRouter';
import { CLIENT_ORIGIN } from './config';

const app = express();

const allowedOrigins = [
  CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use('/auth', authRouter);
app.use('/vehicles', vehicleRouter);
app.use('/services', serviceRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ msg: 'Endpoint not found' });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  res.status(status).json({ msg: err.message || 'Internal Server Error' });
});

export default app;

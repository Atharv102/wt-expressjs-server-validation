/**
 * JobApply — Server Entrypoint
 * ExpressJS Server-Side Validation Application
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jobRoutes from './routes/jobRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in & Third-Party Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', jobRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'JobApply ExpressJS Validation API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 Handler for Unknown API endpoints
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist on this server.`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({
    success: false,
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    message: 'An unexpected server error occurred during request processing.',
    details: err.message
  });
});

// Start Server if executed directly
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  JobApply Recruitment Portal is RUNNING!          `);
    console.log(`  URL: http://localhost:${PORT}                      `);
    console.log(`  API Base: http://localhost:${PORT}/api             `);
    console.log(`  Health: http://localhost:${PORT}/api/health        `);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} in use, attempting port ${Number(PORT) + 1}...`);
      app.listen(Number(PORT) + 1, () => {
        console.log(`Server started on fallback port ${Number(PORT) + 1}`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
}

export default app;


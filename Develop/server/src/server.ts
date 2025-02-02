// Import necessary modules for __dirname workaround
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

// Create __filename and __dirname equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';

import routes from './routes/index.js';

dotenv.config();

// Initialize searchHistory.json if it doesn't exist
const searchHistoryPath = resolve(__dirname, '../../data/searchHistory.json');

if (!fs.existsSync(searchHistoryPath)) {
  fs.writeFileSync(searchHistoryPath, JSON.stringify([]));
  console.log('Initialized searchHistory.json as an empty array.');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for logging API Key (Optional for debugging)
console.log('Loaded API Key:', process.env.API_KEY ? 'Exists' : 'Not Found');

// Serve static files from the client 'dist' folder in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = resolve(__dirname, '../../../client/dist');
  app.use(express.static(clientDistPath));

  // Handle any requests that don't match the API routes
  app.get('*', (_req, res) => {
    res.sendFile(join(clientDistPath, 'index.html'));
  });
}

// Serve a simple response for the root route
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <h1>Welcome to the Weather Dashboard API</h1>
    <p>Available endpoints:</p>
    <ul>
      <li><code>GET /api</code>: API information</li>
      <li><code>GET /api/weather</code>: Fetch weather data</li>
      <li><code>GET /api/history</code>: Retrieve search history</li>
    </ul>
  `);
});

// Add a health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    apiKeyLoaded: !!process.env.API_KEY,
  });
  console.log('Health check performed');
});

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use API routes
app.use('/api', routes);

// Fallback for invalid API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Fallback for all other non-API routes
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error occurred:', err.message);
    res.status(500).json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Test environment variables
console.log('Environment Variables Loaded:');
console.log('API Key:', process.env.API_KEY);
console.log('Port:', process.env.PORT);
console.log('Node Environment:', process.env.NODE_ENV);

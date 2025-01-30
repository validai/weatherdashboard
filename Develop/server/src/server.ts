import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for logging API Key (Optional for debugging)
console.log('Loaded API Key:', process.env.API_KEY ? 'Exists' : 'Not Found');

// Serve static files from the client 'dist' folder in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../../../client/dist');
  app.use(express.static(clientDistPath));

  // Handle any requests that don't match the API routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
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

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use API routes
app.use('/', routes);

// Fallback for invalid API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

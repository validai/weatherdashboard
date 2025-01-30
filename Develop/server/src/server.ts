import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for logging API Key (Optional for debugging)
console.log('Loaded API Key:', process.env.API_KEY ? 'Exists' : 'Not Found');

// Serve static files from the client `dist` folder in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));

  // Handle any requests that don't match the API routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use API routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

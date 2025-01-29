import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('Loaded API Key:', process.env.API_KEY ? 'Exists' : 'Not Found');

// TODO: Serve static files of the entire client dist folder
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// TODO: Implement middleware for parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
app.use('/api', routes);

// Start the server on the port
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

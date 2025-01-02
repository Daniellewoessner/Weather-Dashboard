import dotenv from 'dotenv';
dotenv.config();

console.log('Environment Variables:', {
    apiKey: process.env.WEATHER_API_KEY,
    baseUrl: process.env.API_BASE_URL,
    envPath: process.cwd()
});

import express from 'express';

// Import the routes
import routes from './server/src/routes/index.js';
import weatherRoutes from './server/src/routes/api/weatherRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Debug middleware - add this BEFORE your routes
app.use((req, res, next) => {
    console.log('Request received:', {
        method: req.method,
        path: req.path,
        body: req.body
    });
    next();
});

// Important: Make sure these middleware declarations are BEFORE your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route - add this AFTER middleware but BEFORE other routes
app.post('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Test successful' });
});

// Static files
app.use(express.static(`client/dist`));

// Your API routes
app.use('/api', routes);
app.use('/api/weather', weatherRoutes);

// Add a catch-all error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available routes:');
    console.log('POST /test');
    console.log('POST /api/weather');
});
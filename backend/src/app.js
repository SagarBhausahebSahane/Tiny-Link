// src/app.js - Express application configuration
const express = require('express');
const cors = require('cors');
const linkRoutes = require('./routes/linkRoutes');
const redirectRoute = require('./routes/redirectRoute');
const { errorHandler } = require('./middleware/errorHandler');
require("dotenv").config();



const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body || '');
  next();
});

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true, version: '1.0' });
});

// API routes
app.use('/api/links', linkRoutes);

// Redirect route (must be last to catch /:code)
app.use('/', redirectRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;

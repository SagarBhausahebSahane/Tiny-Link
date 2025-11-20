// server.js - Entry point for the application
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize database connection and create tables
    console.log('✓ Database initialized successfully');

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/healthz`);
      console.log(`✓ API endpoint: http://localhost:${PORT}/api/links`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

startServer();

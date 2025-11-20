// src/middleware/errorHandler.js - Centralized error handling middleware

// Error handler middleware
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Database errors
  if (err.code === '23505') {
    // Unique constraint violation
    return res.status(409).json({
      error: 'Conflict',
      message: 'A link with this code already exists'
    });
  }

  if (err.code === '23514') {
    // Check constraint violation
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid code format'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

// Async handler wrapper to catch errors in async route handlers
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  asyncHandler
};

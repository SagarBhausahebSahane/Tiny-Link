// src/utils/helpers.js - Utility helper functions

// Generate random alphanumeric code
function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

// Validate URL format (re-exported from validators for convenience)
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Format date to ISO string
function formatDate(date) {
  return date ? new Date(date).toISOString() : null;
}

// Sanitize URL (remove trailing slashes, etc.)
function sanitizeUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch {
    return url;
  }
}

module.exports = {
  generateRandomCode,
  isValidUrl,
  formatDate,
  sanitizeUrl
};

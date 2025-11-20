// src/utils/validators.js - Input validation functions

// Validate URL format
function isValidUrl(string) {
  try {
    const url = new URL(string);
    // Ensure it's http or https
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Validate code format (6-8 alphanumeric characters)
function validateCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

// Validate link input
function validateLinkInput(originalUrl, customCode) {
  // Validate original URL
  if (!originalUrl) {
    return { isValid: false, error: 'Original URL is required' };
  }

  if (typeof originalUrl !== 'string') {
    return { isValid: false, error: 'Original URL must be a string' };
  }

  if (originalUrl.length > 2048) {
    return { isValid: false, error: 'URL is too long (max 2048 characters)' };
  }

  if (!isValidUrl(originalUrl)) {
    return { isValid: false, error: 'Invalid URL format. Must be a valid HTTP or HTTPS URL' };
  }

  // Validate custom code if provided
  if (customCode !== null && customCode !== undefined && customCode !== '') {
    if (typeof customCode !== 'string') {
      return { isValid: false, error: 'Custom code must be a string' };
    }

    if (!validateCode(customCode)) {
      return { isValid: false, error: 'Custom code must be 6-8 alphanumeric characters' };
    }
  }

  return { isValid: true };
}

module.exports = {
  isValidUrl,
  validateCode,
  validateLinkInput
};

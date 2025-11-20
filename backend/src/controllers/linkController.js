// src/controllers/linkController.js - Business logic for link operations
const Link = require('../models/Link');
const { isValidUrl, generateRandomCode } = require('../utils/helpers');
const { validateLinkInput, validateCode } = require('../utils/validators');

// Create a new short link
exports.createLink = async (req, res, next) => {
  try {
    const { original_url, custom_code } = req.body;

    // Validate input
    const validation = validateLinkInput(original_url, custom_code);
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation Error', message: validation.error });
    }

    // Determine the code to use
    let code = custom_code;

    if (custom_code) {
      // Check if custom code already exists
      const exists = await Link.codeExists(custom_code);
      if (exists) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Custom code already exists. Please choose a different code.'
        });
      }
    } else {
      // Generate random code and ensure uniqueness
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        code = generateRandomCode(6);
        const exists = await Link.codeExists(code);
        if (!exists) break;
        attempts++;
      }

      if (attempts === maxAttempts) {
        return res.status(500).json({
          error: 'Server Error',
          message: 'Failed to generate unique code. Please try again.'
        });
      }
    }

    // Create the link
    const link = await Link.create(code, original_url);

    // Return created link with short URL
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
    res.status(201).json({
      ...link,
      short_url: `${baseUrl}/${link.code}`
    });

  } catch (error) {
    next(error);
  }
};

// Get all links
exports.getAllLinks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    const links = await Link.findAll(limit, offset);
    const total = await Link.count();

    res.status(200).json(links);
  } catch (error) {
    next(error);
  }
};

// Get link by code
exports.getLinkByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    // Validate code format
    if (!validateCode(code)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid code format'
      });
    }

    const link = await Link.findByCode(code);

    if (!link) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Link not found'
      });
    }

    const baseUrl = process.env.BASE_URL;
    res.status(200).json({
      ...link,
      short_url: `${baseUrl}/${link.code}`
    });

  } catch (error) {
    next(error);
  }
};

// Delete link by code
exports.deleteLink = async (req, res, next) => {
  try {
    const { code } = req.params;

    // Validate code format
    if (!validateCode(code)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid code format'
      });
    }

    const deletedLink = await Link.deleteByCode(code);

    if (!deletedLink) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Link not found'
      });
    }

    res.status(200).json({
      message: 'Link deleted successfully',
      deleted: deletedLink
    });

  } catch (error) {
    next(error);
  }
};

// Handle redirect
exports.redirectToOriginal = async (req, res, next) => {
  try {
    const { code } = req.params;

    // Validate code format
    if (!validateCode(code)) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Link not found'
      });
    }

    const link = await Link.findByCode(code);

    if (!link) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Link not found'
      });
    }

    // Increment click count asynchronously (don't wait)
    Link.incrementClickCount(code).catch(err => {
      console.error('Failed to increment click count:', err);
    });

    // Redirect to original URL
    res.redirect(302, link.original_url);

  } catch (error) {
    next(error);
  }
};

// src/routes/redirectRoute.js - Redirect route handler
const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');

// GET /:code - Redirect to original URL
router.get('/:code', linkController.redirectToOriginal);

module.exports = router;

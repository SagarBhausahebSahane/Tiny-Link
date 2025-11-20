// src/routes/linkRoutes.js - API routes for link management
const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');

// POST /api/links - Create a new short link
router.post('/', linkController.createLink);

// GET /api/links - Get all links
router.get('/', linkController.getAllLinks);

// GET /api/links/:code - Get specific link stats
router.get('/:code', linkController.getLinkByCode);

// DELETE /api/links/:code - Delete a link
router.delete('/:code', linkController.deleteLink);

module.exports = router;

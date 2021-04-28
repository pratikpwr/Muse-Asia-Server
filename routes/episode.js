const express = require('express');

const episodeController = require('../controllers/episode');

const router = express.Router();

// GET /episode/add-latest
router.get('/add-latest', episodeController.addLatest);

// Get /episode/recent - get recent episodes
router.get('/recent', episodeController.getRecent);

// GET /episode/:episodeId - get a specific episode
router.get('/:episodeId', episodeController.getEpisode);

module.exports = router;
const express = require('express');

const episodeController = require('../controllers/episode');

const router = express.Router();

// GET /episode/add-latest
router.get('/add-latest', episodeController.addLatest);

// GET /episode/:episodeId - get a specific episode
router.get('/:episodeId', episodeController.getEpisode);

// Get /episode/recent - get recent episodes
router.get('/recent', episodeController.getRecent);

module.exports = router;
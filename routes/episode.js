const express = require('express');

const episodeController = require('../controllers/episode');

const router = express.Router();

router.get('/:episodeId', episodeController.getEpisode);

router.get('/recent', episodeController.getRecent);

module.exports = router;
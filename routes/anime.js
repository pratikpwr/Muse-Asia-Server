const express = require('express');
const animeController = require('../controllers/anime');

const router = express.Router();

// GET /anime - get all anime
router.get('/', animeController.getAllAnime);

// POST /anime/add-anime - add anime
router.post('/add-anime', animeController.addAnime);

// GET /anime/:animeId - get specific anime
router.get('/:animeId', animeController.getAnime);

// PUT /anime/:animeId - edit specific anime
router.put('/:animeId', animeController.editAnime);

// DELETE /anime/:animeId - delete specific anime
router.delete('/:animeId', animeController.deleteAnime);



module.exports = router;
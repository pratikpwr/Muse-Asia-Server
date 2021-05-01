const express = require('express');
const { body } = require("express-validator");

const animeController = require('../controllers/anime');
const isAuth = require("../middleware/is_auth");

const router = express.Router();

// GET /anime - get all anime
router.get('/',isAuth, animeController.getAllAnime);

// POST /anime/add-anime - add anime
router.post(
    '/add-anime',
    isAuth,
    [
        body("title").trim().isLength({ min: 1 }),
        body("description").trim().isLength({ min: 1 }),
        body("japTitle").trim().isLength({ min: 1 }),
        body("imageUrl").trim().isLength({ min: 1 }),
        body("rating").trim().isLength({ min: 1 }),
        body("playlistId").trim().isLength({ min: 1 }),
        body("japPlaylistId").trim().isLength({ min: 1 }),
    ],
   animeController.addAnime
);

// GET /anime/:animeId - get specific anime
router.get('/:animeId',isAuth, animeController.getAnime);

// PUT /anime/:animeId - edit specific anime
router.put(
    '/:animeId',
    isAuth,
    [
        body("title").trim().isLength({ min: 1 }),
        body("description").trim().isLength({ min: 1 }),
        body("japTitle").trim().isLength({ min: 1 }),
        body("imageUrl").trim().isLength({ min: 1 }),
        body("rating").trim().isLength({ min: 1 }),
        body("playlistId").trim().isLength({ min: 1 }),
        body("japPlaylistId").trim().isLength({ min: 1 }),
    ],
    animeController.editAnime
);

// DELETE /anime/:animeId - delete specific anime
router.delete('/:animeId',isAuth, animeController.deleteAnime);

// GET /anime/episodes/:animeId - list of episodes of an anime
router.get('/episodes/:animeId',isAuth, animeController.getEpisodesOfAnime);


module.exports = router;
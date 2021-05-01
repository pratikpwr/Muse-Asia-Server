const { validationResult } = require("express-validator");

const Anime = require('../models/anime');
const Episode = require('../models/episode');
const YoutubeAPI = require('../api/youtube');

exports.getAllAnime= async (req, res, next) =>{

    try {
        anime = await Anime.find();

        throwError({
            condition: !anime,
            errMsg: 'Anime not Found!',
            statusCode: 404
        });

        let allAnime = [];

        for(i=0; i<anime.length; i++){
            let ani = {};

            ani.id = anime[i].id;
            ani.title = anime[i].title;
            ani.imageUrl = anime[i].imageUrl;
            ani.rating = anime[i].rating;

            allAnime.push(ani);
        }

        res.status(200).json({
            message: "Success! List of all Anime." ,
            statusCode: 200,
            anime: allAnime
        });

    } catch (err) {
        catchError({next: next, error: err});
    }
};

exports.addAnime = async (req, res, next) => {
    const errors = validationResult(req);
    throwError({
        condition: !errors.isEmpty,
        errMsg: "Validation Failed, Enter valid data.",
        statusCode: 422,
    });

    const title = req.body.title;
    const japTitle = req.body.japTitle;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const rating = req.body.rating;
    const playlistId = req.body.playlistId;
    const japPlaylistId = req.body.japPlaylistId;

    await Anime.deleteOne({title: title});

    const newAnime = new Anime({
        title: title,
        japTitle: japTitle,
        description: description,
        imageUrl: imageUrl,
        rating: rating,
        playlistId: playlistId,
        japPlaylistId: japPlaylistId
    });

    try {
        const anime = await newAnime.save();

        // TODO : add episodes here using youtube api

        YoutubeAPI.fetchEpisodes(anime._id).then((animeWithEpisodes)=>{
            res.status(200).json({
                message: "Success! Anime added.",
                statusCode: 200,
                anime: animeWithEpisodes
            });
        }).catch((err) => {
            catchError({next: next, error: err});
        });

    } catch (err) {
        catchError({next: next, error: err});
    }
};

exports.getAnime = async (req, res, next) => {

    const animeId = req.params.animeId;

    try{
        const anime = await Anime.findById(animeId);

        throwError({
            condition: !anime,
            errMsg: 'Anime not Found!',
            statusCode: 404
        });

        res.status(200).json({
            message: "Success! Anime found." ,
            statusCode: 200,
            anime: anime
        });
    } catch (err) {
        catchError({next: next, error: err});
    }
};

exports.editAnime = async (req, res, next) => {
    const errors = validationResult(req);
    throwError({
        condition: !errors.isEmpty,
        errMsg: "Validation Failed, Enter valid data.",
        statusCode: 422,
    });

    const animeId = req.params.animeId;
    const title = req.body.title;
    const japTitle = req.body.japTitle;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const rating = req.body.rating;
    const playlistId = req.body.playlistId;
    const japPlaylistId = req.body.japPlaylistId

    try{

        const anime = await  Anime.findById(animeId);

        throwError({
            condition: !anime,
            errMsg: 'Anime not Found!',
            statusCode: 404
        });

        anime.title = title;
        anime.japTitle = japTitle;
        anime.description = description;
        anime.imageUrl = imageUrl;
        anime.rating = rating;
        anime.playlistId = playlistId;
        anime.japPlaylistId = japPlaylistId;

        const updatedAnime = await anime.save();

        throwError({
            condition: !updatedAnime,
            errMsg: 'Anime not Found!',
            statusCode: 404
        });

        res.status(200).json({
            message: "Success! Anime Updated." ,
            statusCode: 200,
            anime: updatedAnime
        });

    } catch (err) {
        catchError({next: next, error: err});
    }
};

exports.deleteAnime = async (req, res, next) => {

    const animeId = req.params.animeId;

    try{

        const anime =  await Anime.findByIdAndDelete(animeId);

        throwError({
            condition: !anime,
            errMsg: 'Anime not Found!',
            statusCode: 404
        });

         // TODO :  Delete episodes related to anime

        await Episode.deleteMany({anime: animeId});

        res.status(200).json({
            message: "Success! Anime Deleted." ,
            statusCode: 200,
        });

    } catch (err) {
        catchError({next: next, error: err});
    }
};


exports.getEpisodesOfAnime = async (req, res, next) => {

    const animeId = req.params.animeId;

    try {

      const episodes = await Episode.find({anime: animeId}).sort({episodeNo: 1});
      // .sort([{episodeNo : 'ASC'}])

        throwError({
            condition: !episodes,
            errMsg: 'Episodes Not Found!',
            statusCode: 404
        });

        let allEpisodes = [];

        for(i=0;i< episodes.length; i++){

            let epi = {} ;

            epi.id = episodes[i]._id;
            epi.title = episodes[i].title;
            epi.imageUrl = episodes[i].imageUrl;
            epi.episodeNo = episodes[i].episodeNo;
            epi.subtitle = episodes[i].sub;

            allEpisodes.push(epi);
        }

      res.status(200).json({
          statusCode: 200,
          message: 'Success! Episodes Found.',
          episodes: allEpisodes
      })

    } catch (err) {
        catchError({next: next, error: err});
    }

};

const throwError = ({ condition, errMsg, statusCode }) => {
    if (condition) {
      const error = new Error(errMsg);
      error.statusCode = statusCode;
      throw error;
    }
};
  
const catchError = ({ next, error }) => {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
};
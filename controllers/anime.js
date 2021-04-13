const { validationResult } = require("express-validator");

const Anime = require('../models/anime');

exports.getAllAnime= async (req, res, next) =>{


    Anime.find().then((anime)=> {

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
    }).catch((err) => {
        catchError({next: next, error: err});
    });
};

exports.addAnime = (req, res, next) => {
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

    const anime = new Anime({
        title: title,
        japTitle: japTitle,
        description: description,
        imageUrl: imageUrl,
        rating: rating,
        playlistId: playlistId,
        japPlaylistId: japPlaylistId
    });

    anime.save().then((anime) => {
        res.status(201).json({
            message: "Success! Anime added." ,
            statusCode: 201,
            anime: anime
        });
    }).catch((err) => {
        catchError({next: next, error: err});
    });
}

exports.getAnime = (req, res, next) => {

    const animeId = req.params.animeId;

    Anime.findById(animeId).then((anime)=> {

        throwError({
            condition: !anime,
            errMsg: 'Anime not Found!',
            statusCode: 404
        })

        res.status(200).json({
            message: "Success! Anime found." ,
            statusCode: 200,
            anime: anime
        });
    }).catch((err) => {
        catchError({next: next, error: err});
    });
}

exports.editAnime = (req, res, next) => {
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

    Anime.findById(animeId).then((anime)=>{
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

        return anime.save();
    }).then((updatedAnime)=> {

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
    }).catch((err) => {
        catchError({next: next, error: err});
    });
}

exports.deleteAnime = (req, res, next) => {
    const animeId = req.params.animeId;

    Anime.findByIdAndDelete(animeId).then((anime)=> {

        throwError({
            condition: !anime,
            errMsg: 'Anime not Found!',
            statusCode: 404
        });

        res.status(200).json({
            message: "Success! Anime Deleted." ,
            statusCode: 200,
        });
    }).catch((err) => {
        catchError({next: next, error: err});
    });
}

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
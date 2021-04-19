
const Anime = require('../models/anime');
const Episode = require('../models/episode');
const YoutubeAPI = require('../api/youtube');

exports.getRecent = (req, res, next) => {
    res.status(200).json({message: "Success" , statusCode: 200});
}

exports.addLatest = async (req, res, next) => {
    // to add latest episodes
    // for every anime in db get anime Id
    // with anime Id add latest episodes to db

    try{

        const allAnime = await Anime.find();

        throwError({
            condition: !allAnime,
            errMsg: 'Animes Not Found!',
            statusCode: 404
        });

        for (i =0 ; i< allAnime.length; i++){
            await YoutubeAPI.fetchEpisodes(allAnime[i]._id);
        }

        res.status(200).json({
            message: "Success! Latest Episodes Added." ,
            statusCode: 200
        });

    } catch(err){
        catchError({next: next, error: err});
    }
}

exports.getEpisode = async (req, res, next) => {

    const episodeId = req.params.episodeId

    try{

        const episode = await Episode.findById(episodeId);

        throwError({
            condition: !episode,
            errMsg: 'Episode Not Found!',
            statusCode: 404
        });

        res.status(200).json({
            message: "Success",
            statusCode: 200,
            episode: episode
        });

    } catch(err){
        catchError({next: next, error: err});
    }
    
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
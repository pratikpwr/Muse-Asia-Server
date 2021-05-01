
const Anime = require('../models/anime');
const Episode = require('../models/episode');
const YoutubeAPI = require('../api/youtube');

exports.getRecent = async (req, res, next) => {


    // arrange as release date latest at top 
    // then get top 15 

    // OR
    // get the episodes released this week only

    try{

        const episodes = await Episode.find({sub:true}).sort({releaseDate: "DESC"}).limit(15).populate('anime');
        
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
            epi.imageUrl = episodes[i].anime.imageUrl;
            epi.episodeNo = episodes[i].episodeNo;
            epi.subtitle = episodes[i].sub;
            epi.anime = episodes[i].anime.title;

            allEpisodes.push(epi);
        }

      res.status(200).json({
          statusCode: 200,
          message: 'Success! Recent Episodes Found.',
          episodes: allEpisodes
      })

    }catch(err){
        catchError({next: next, error: err});
    }

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
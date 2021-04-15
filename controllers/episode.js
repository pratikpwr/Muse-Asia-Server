
const Episode = require('../models/episode');

exports.getRecent = (req, res, next) => {
    res.status(200).json({message: "Success" , statusCode: 200});
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
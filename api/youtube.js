const superagent = require('superagent');

const Anime = require('../models/anime');
const Episode = require('../models/episode');


exports.fetchEpisodes = async (animeId) => {

    let anime = await Anime.findById(animeId);
    await Episode.deleteMany({anime: animeId});
    
    const youtubeAPIKey= 'AIzaSyA0kVrh5LwfELmViRbPfX2dCMTkC1Jy8Ag';
    let nextVideosPageToken = '';

    superagent.get('https://www.googleapis.com/youtube/v3/playlistItems')
    .query({
        part: ["snippet,contentDetails"],
        playlistId: anime.playlistId,
        maxResults: '50',
        pageToken: nextVideosPageToken,
        key: youtubeAPIKey,
    })
    .end(async (err, res) => {
        if(err){
            return console.log(err);
        }

        // TODO : Add next page token logic
        
        const playlistItems = res.body.items;
        let allEpisodes = [];

        for(i=0; i< playlistItems.length; i++){


            // Episode.find({videoId: playlistItems[i].contentDetails.videoId}).then((oldEpi)=> {
            //     Episode.findByIdAndDelete(oldEpi._id);
            // });

            const episode = new Episode({
                title : playlistItems[i].snippet.title,
                imageUrl : playlistItems[i].snippet.thumbnails.high.url,
                description : playlistItems[i].snippet.description,
                releaseDate : playlistItems[i].contentDetails.videoPublishedAt,
                episodeNo : i + 1,
                videoId : playlistItems[i].contentDetails.videoId,
                anime: animeId,
                sub: true
            });

            // if video with same videoId exists in db then old one will be deleted

            episode.save().then((savedEpisode) =>{
                // allEpisodes.push(savedEpisode._id);
                anime.episodes.push(savedEpisode._id);
            });    
            
        }

        // TODO:  Solve episode not added to anime bug

        // anime.episodes.push(allEpisodes);
    });


    // for japanese playlist
    superagent.get('https://www.googleapis.com/youtube/v3/playlistItems')
    .query({
        part: ["snippet,contentDetails"],
        playlistId: anime.japPlaylistId,
        maxResults: '50',
        pageToken: nextVideosPageToken,
        key: youtubeAPIKey,
    })
    .end(async (err, res) => {
        if(err){
            return console.log(err);
        }
        
        const playlistItems = res.body.items;
        let allEpisodes = [];

        for(i=0; i< playlistItems.length; i++){

            const episode = new Episode({
                title : playlistItems[i].snippet.title,
                imageUrl : playlistItems[i].snippet.thumbnails.high.url,
                description : playlistItems[i].snippet.description,
                releaseDate : playlistItems[i].contentDetails.videoPublishedAt,
                episodeNo : i + 1,
                videoId : playlistItems[i].contentDetails.videoId,
                anime: animeId,
                sub: false
            });

            episode.save().then((savedEpisode) =>{
                anime.japEpisodes.push(savedEpisode._id);
            });    
            
        }
    });

    return await anime.save();
}


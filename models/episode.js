const mongoose = require('mongoose');
const { modelName } = require('../models/anime');

const Anime = require('../models/anime');

const Schema = mongoose.Schema;


const episodeSchema = Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        releaseDate:{
            type: String,
        },
        episodeNo:{
            type: Number,
            required : true
        },
        videoId: {
            type: String,
            required: true
        },
        anime:{
            type: Schema.Types.ObjectId,
            ref: "Anime",
            required: true
        },
        sub:{
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Episode", episodeSchema);
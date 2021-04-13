const mongoose = require("mongoose");

const Episode = require('../models/episode');

const Schema = mongoose.Schema;

const animeSchema = Schema(
    {
        title: {
            type: String,
            required: true,
        },
        japTitle: {
            type: String,
        },
        description:{
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        rating:{
            type: Number,
            required: true
        },
        playlistId:{
            type: String,
            required: true
        },
        japPlaylistId:{
            type:String
        },
        episodes:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Episode'
            }
        ],
        japEpisodes:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Episode'
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Anime", animeSchema);
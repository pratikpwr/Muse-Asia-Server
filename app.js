const express = require('express');
const mongoose = require('mongoose');

const animeRoute = require('./routes/anime');


const app = express();

app.use('/anime', animeRoute);

mongoose.connect(
    "mongodb+srv://mongodb:mongodb@nodeblog.evthp.mongodb.net/museAPI?retryWrites=true&w=majority"
).then((result) => {
    app.listen(8080);
  }).catch((err) => console.log(err));
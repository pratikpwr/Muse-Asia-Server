const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require("body-parser");

const animeRoute = require('./routes/anime');
const episodeRoute = require('./routes/episode');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());



app.use('/anime', animeRoute);

app.use('/episode', episodeRoute);

app.use('/', (req,res,next)=>{
    res.json({message: 'Hello World'});
})

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ statusCode: status, message: message, data: data });
});

mongoose.connect(
    "mongodb+srv://mongodb:mongodb@nodeblog.evthp.mongodb.net/museAPI?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
).then((result) => {
    app.listen(port);
    console.log(`Server started at port ${port}!!`);
}).catch((err) => console.log(err));
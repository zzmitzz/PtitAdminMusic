const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const AlbumSchema = new mongoose.Schema({
    name_Album: String,
    tracks: [
        {
            type: Object
        }
    ],
    image: String,
});

const Album = mongoose.model("Album", AlbumSchema, "AlbumData");

module.exports = Album;
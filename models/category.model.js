const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const CategorySchema = new mongoose.Schema({
    Category: String,
    tracks: [
        {
            type: Object
        }
    ],
    image: String,
});

const Category = mongoose.model("Category", CategorySchema, "CategoryData");

module.exports = Category;
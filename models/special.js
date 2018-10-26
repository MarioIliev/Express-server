const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const specialSchema = new Schema({
    name: String,
    theme: String,
    description: String,
    imageUrl: String,
    videoUrl: String,
    date: Date
});

module.exports = mongoose.model('special', specialSchema, 'specials');
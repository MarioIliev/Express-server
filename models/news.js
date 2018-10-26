const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: String,
    description: String,
    description1: String,
    imageUrl: String,
    videoUrl: String,
    author: String,
    date: Date
});

module.exports = mongoose.model('news', newsSchema, 'newses');
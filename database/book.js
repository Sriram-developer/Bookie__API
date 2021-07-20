const mongoose = require("mongoose");

// Creating a Book Schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numofpage: Number,
    category: [String],
    publication: Number,

});

// Create a Book Model
const BookModel = mongoose.model(BookSchema);

module.exports = BookModel;
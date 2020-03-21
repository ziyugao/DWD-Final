// 1. Read in your mongoose library
const mongoose = require('mongoose');
// 2. Get the Schema class from mongoose
const Schema = mongoose.Schema;
// 3. Define the database model schema for your images
const imageSchema = new Schema({
  "data": String
});

// 4. create a new mongodb model called: "images"
const db = mongoose.model('images', imageSchema)
// 5. make this images model available to your app
module.exports = db;
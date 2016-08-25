var mongoose = require('mongoose');

var placeSchema = new mongoose.Schema({
  placeId: String,
  name: String,
  categories: Array,
  location: String,
  latLng: {
    lat: Number,
    lng: Number
  },
  rating: Number,
  photo: String
});

module.exports = mongoose.model('Place', placeSchema);
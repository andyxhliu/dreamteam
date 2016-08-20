var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  postcode: { type: String, required: true },
  categories: [{ type: String, required: true }],
  location: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
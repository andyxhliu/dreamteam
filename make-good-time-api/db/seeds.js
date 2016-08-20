var mongoose = require('mongoose');
var Activity = require('../models/activity');

var databaseUri = require('../config/db')('development');
mongoose.connect(databaseUri);

Activity.collection.drop();

Activity.create([
  {
    name: "High Bar",
    categories: ["Bears", "Entertainment"],
    description: "The best bar rated by London Bar Insitution",
    photo: "http://d2cd7s18nw3zcy.cloudfront.net/files/hotel/buddha-bar-hotel-budapest-klotild-palace/dining/Lounge/BarMixer.jpg",
    lat: 51.9,
    lng: 31.6,
    postcode: "SW7 4XQ",
    location: "3a Cromwell Road, London"
  },
  { 
    name: "Low Bar",
    categories: ["Bears", "Entertainment"],
    description: "The cheapest bar rated by London Bar Insitution",
    photo: "https://affotd.files.wordpress.com/2011/03/swimming-pool-bar1.jpg",
    lat: 53,
    lng: 33,
    postcode: "SW7 4XX",
    location: "3a Cromwell Road, London"
  }
], function(err, activities) {
  console.log(activities);
  mongoose.connection.close();
})
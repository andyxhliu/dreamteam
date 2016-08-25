var User = require("../models/user");
var Place = require('../models/place');

function favorite(req, res) {

  // find favorite by place_id
  Place.findOne({ placeId: req.params.placeId })
    .then(function(place) {
      if(!place) {
        return Place.create(req.body)
      }
      return new Promise(function(resolve, reject) { resolve(place); });
    })
    .then(function(place) {
      return User.findById(req.user._id)
        .then(function(user) {

          var idx = user.favorites.indexOf(place._id.toString());

          if(idx === -1) {
            user.favorites.push(place);
          } else {
            user.favorites.splice(idx, 1);
          }

          return user.save();
        });
    })
    .then(function(user) {
      res.status(200).json(user);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
};

function me(req, res) {
  User.findById(req.user._id).populate('favorites').exec(function(err, user) {
    if(err) return res.status(500).json(err);

    return res.status(200).json(user);
  });
}

module.exports = {
  favorite: favorite,
  me: me
}
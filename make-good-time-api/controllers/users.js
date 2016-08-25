var User = require("../models/user");

function usersIndex(req, res){
  User.find(function(err, users){
    if (err) return res.status(404).json({ message: "Couldn't find the users"});
    res.status(200).json({ users: users });
  });
}

function usersShow(req, res){
  User.findById(req.params.id, function(err, user){
    if (err) return res.status(404).json({ message: "Couldn't find the user"});
    res.status(200).json({ user: user });
  });
}

function usersUpdate(req, res){
  User.findByIdAndUpdate({ _id: req.params.id }, req.body.user, {new: true}, function(err, user){
   if (err) return res.status(500).json(err);
   if (!user) return res.status(404).json(err);
   res.status(200).json({ user: user }); 
  });
}

module.exports = {
  index: usersIndex,
  show: usersShow,
  update: usersUpdate
}
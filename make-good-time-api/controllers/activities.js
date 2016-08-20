var Activity = require('../models/activity');

function activitiesIndex(req, res) {
  Activity.find(function(err, activities) {
    if(err) return res.status(500).json(err);
    return res.status(200).json(activities);
  });
}

function activitiesCreate(req, res) {
  Activity.create(req.body, function(err, activity) {
    if(err) return res.status(400).json(err);
    return res.status(201).json(activity);
  });
}

function activitiesShow(req, res) {
  Activity.findById(req.params.id, function(err, activity) {
    if(err) return res.status(500).json(err);
    if(!activity) return res.status(404).json({ message: "Could not find a activity with tha id" });
    return res.status(200).json(activity);
  });
}

function activitiesUpdate(req, res) {
  Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }, function(err, activity) {
    if(err) return res.status(400).json(err);
    return res.status(200).json(activity);
  });
}

function activitiesDelete(req, res) {
  Activity.findByIdAndRemove(req.params.id, function(err) {
    if(err) return res.status(500).json(err);
    return res.status(204).send();
  });
}

module.exports = {
  index: activitiesIndex,
  create: activitiesCreate,
  show: activitiesShow,
  update: activitiesUpdate,
  delete: activitiesDelete
}

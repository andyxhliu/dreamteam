// create an express router
var router = require('express').Router();

// require our controller(s)
var authController = require('../controllers/authentications');
var usersController = require("../controllers/users");
var secret = require('../config/token').secret;
var jwt = require('jsonwebtoken');

//middleware to check for token
function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: "Unauthorized" });

  var token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, function(err, payload) {
    if(err || !payload) return res.status(401).json({ message: "Unauthorized" });

    req.user = payload;
    next();
  });
}

router.post('/register', authController.register);
router.post('/login', authController.login);

router.put('/favorite/:placeId', secureRoute, usersController.favorite);
router.get('/me', secureRoute, usersController.me);

// export the router
module.exports = router;

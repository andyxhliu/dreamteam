dbURIs = {
  test: "mongodb://localhost/make-good-time-api-test",
  development: "mongodb://localhost/make-good-time-api",
  production: process.env.MONGODB_URI || "mongodb://localhost/make-good-time-api"
}

module.exports = function(env) {
  return dbURIs[env];
}
process.env.NODE_ENV = 'test';

var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

var app = require('../app');
var api = supertest(app);

var Activity = require('../models/activity');
var User = require('../models/user');

var TOKEN;

describe("Tests", function() {
  
  this.timeout(5000);

  beforeEach(function(done) {
    Activity.collection.drop();
    done();
  });

  describe("GET /api/activities", function() {

    it("should return a 200 response", function(done) {
      api.get('/api/activities')
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it("should return an array", function(done) {
      api.get('/api/activities')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it("should return an array of objects that contain a 'name' property", function(done) {

      var activity = new Activity({
        name: "The Fox",
        categories: ["Bars", "Beer", "Outdoor Activities"],
        description: "This spacious pub has a great selection of local craft beers on draught. Be sure to head up to the rooftop patio if you visit on a fine day!",
        photo: "http://img01.beerintheevening.com/7a/7a4fc0bf5911b00dc946a389c7761f85.jpg",
        lat: 51.540805,
        lng: -0.076285,
        postcode: "E8 4DA",
        location: "372 Kingsland Road, London"
      });

      activity.save(function(err, activity) {
        api.get('/api/activities')
          .set('Accept', 'application/json')
          .end(function(err, res) {
            expect(res.body[0]).to.have.property('name');
            done();
          });
      });
    });
  });

  describe("POST /api/activities without token", function() {

    it("should return a 401 response", function(done) {
      api.post('/api/activities')
        .set('Accept', 'application/json')
        .send({
          name: "The Fox",
          categories: ["Bars", "Beer", "Outdoor Activities"],
          description: "This spacious pub has a great selection of local craft beers on draught. Be sure to head up to the rooftop patio if you visit on a fine day!",
          photo: "http://img01.beerintheevening.com/7a/7a4fc0bf5911b00dc946a389c7761f85.jpg",
          lat: 51.540805,
          lng: -0.076285,
          postcode: "E8 4DA",
          location: "372 Kingsland Road, London"
        }).expect(401, done);
    });

  });

  describe("POST /api/activities with token", function() {

    beforeEach(function(done) {
      var user = new User({
        username: "test",
        email: "test@test.com",
        password: "password",
        passwordConfirmation: "password"
      });

      user.save(function(err, user) {
        api.post('/api/login')
          .set("Accept", "application/json")
          .send({
            email: "test@test.com",
            password: "password"
          }).end(function(err, res) {
            TOKEN = res.body.token;
            done();
          });
      });
    });

    it("should return a 201 response", function(done) {
      api.post('/api/activities')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + TOKEN)
        .send({
          name: "The Fox",
          categories: ["Bars", "Beer", "Outdoor Activities"],
          description: "This spacious pub has a great selection of local craft beers on draught. Be sure to head up to the rooftop patio if you visit on a fine day!",
          photo: "http://img01.beerintheevening.com/7a/7a4fc0bf5911b00dc946a389c7761f85.jpg",
          lat: 51.540805,
          lng: -0.076285,
          postcode: "E8 4DA",
          location: "372 Kingsland Road, London"
        }).expect(201, done);
    });
  });

  describe("GET /api/activities/:id", function() {
    it("should return a 200 response", function(done) {
      var activity = new Activity({
        name: "The Fox",
        categories: ["Bars", "Beer", "Outdoor Activities"],
        description: "This spacious pub has a great selection of local craft beers on draught. Be sure to head up to the rooftop patio if you visit on a fine day!",
        photo: "http://img01.beerintheevening.com/7a/7a4fc0bf5911b00dc946a389c7761f85.jpg",
        lat: 51.540805,
        lng: -0.076285,
        postcode: "E8 4DA",
        location: "372 Kingsland Road, London"
      });

      activity.save(function(err, activity) {
        api.get('/api/activities/' + activity.id)
          .set('Accept', 'application/json')
          .expect(200, done);
      });
    });
  });

  describe("DELETE /api/activities/:id without token", function() {

    it("should return a 401 response", function(done) {
      var activity = new Activity({
        name: "The Fox",
        categories: ["Bars", "Beer", "Outdoor Activities"],
        description: "This spacious pub has a great selection of local craft beers on draught. Be sure to head up to the rooftop patio if you visit on a fine day!",
        photo: "http://img01.beerintheevening.com/7a/7a4fc0bf5911b00dc946a389c7761f85.jpg",
        lat: 51.540805,
        lng: -0.076285,
        postcode: "E8 4DA",
        location: "372 Kingsland Road, London"
      });

      activity.save(function(err, activity) {
        api.delete('/api/activities/' + activity.id)
          .set('Accept', 'application/json')
          .expect(401, done);
      });
    });

  });

  describe("DELETE /api/activities/:id with token", function() {

    beforeEach(function(done) {
      var user = new User({
        username: "test",
        email: "test@test.com",
        password: "password",
        passwordConfirmation: "password"
      });

      user.save(function(err, user) {
        api.post('/api/login')
          .set("Accept", "application/json")
          .send({
            email: "test@test.com",
            password: "password"
          }).end(function(err, res) {
            TOKEN = res.body.token;
            done();
          });
      });
    });

    // it("should return a 204 response", function(done) {
    //   var activity = new Activity({
    //     name: "The Fox",
    //     categories: ["Bars", "Beer", "Outdoor Activities"],
    //     description: "This spacious pub has a great selection of local craft beers on draught. Be sure to head up to the rooftop patio if you visit on a fine day!",
    //     photo: "http://img01.beerintheevening.com/7a/7a4fc0bf5911b00dc946a389c7761f85.jpg",
    //     lat: 51.540805,
    //     lng: -0.076285,
    //     postcode: "E8 4DA",
    //     location: "372 Kingsland Road, London"
    //   });

    //   activity.save(function(err, activity) {
    //     api.delete('/api/activity/' + activity.id)
    //       .set('Accept', 'application/json')
    //       .set('Authorization', 'Bearer ' + TOKEN)
    //       .expect(204, done);
    //   });
    // });
  });

});
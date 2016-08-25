var GoodTimeApp = GoodTimeApp || {};

GoodTimeApp.API_URL = "/api";

GoodTimeApp.getTemplate = function(template, data) {
  return $.get('/templates/' + template + '.html').done(function(templateHtml) {
    if (template !== 'index' && template !== 'show') {
      GoodTimeApp.activityData = [];
      GoodTimeApp.$sideBar.empty();
      $('#main-nav').css('background-color', 'transparent');
    } else {
      $('#map').show();
      $('#main-nav').css('background-color', 'rgba(255,255,255,0.6)');
    } 
    if (template === 'homepage') {
      $('#brand-header').hide();
      $('.home-logo').hide();
    } else {
      $('#brand-header').show();
      $('.home-logo').show();
    }
    if (template !== 'index') {
      $('#side-bar').hide();
    }

    var html = _.template(templateHtml)(data);
    GoodTimeApp.$main.html(html);
    GoodTimeApp.updateUI();
  });
}


GoodTimeApp.getUser = function(){
  return $.ajax({
    method: "GET",
    url: GoodTimeApp.API_URL + "/users",
    beforeSend: GoodTimeApp.setRequestHeader
    }).done(function(data) {
      GoodTimeApp.getTemplate("show", { users: data });
      console.log(data);
    });
}

GoodTimeApp.favoritePlace = function(marker){

  var position = marker.getPosition();

  var data = {
    placeId: marker.id,
    name: marker.name,
    location: marker.location,
    latLng: { lat: position.lat(), lng: position.lng() },
    rating: marker.rating,
    categories: marker.categories.split(" "),
    photo: marker.photo
  }

  console.log(data);

  return $.ajax({
    method: "PUT",
    url: GoodTimeApp.API_URL + "/favorite/" + marker.id,
    data: data,
    beforeSend: GoodTimeApp.setRequestHeader
  }).done(function(data) {
    console.log(data);
  });
}

GoodTimeApp.showUser = function(){
  return $.ajax({
      method: "GET",
      url: GoodTimeApp.API_URL + "/me",
      beforeSend: GoodTimeApp.setRequestHeader
      }).done(function(data) {
        GoodTimeApp.getTemplate("show", { user: data });
        console.log("Heres the logged in user!", data);
      });
}

GoodTimeApp.loadPage = function() {
  // GoodTimeApp.reset();
  event.preventDefault();
  GoodTimeApp.getTemplate($(this).data('template'));
}

GoodTimeApp.initEventHandlers = function() {
  this.$map = $("#map");
  this.$column = $(".column");
  this.$user = $("#user");
  this.$main = $("main");
  this.$option = $(".filters :checkbox");
  this.$option.on("click", function() {
    return this.value
  });
  this.$main.on('click', '#select-filters', GoodTimeApp.submitMarkers);
  GoodTimeApp.initializeMap();
  GoodTimeApp.getPlaceUrls();

  this.$main.on("submit", "form", this.handleForm);
  $(document).on('click', '#show-map', function() {
    GoodTimeApp.getTemplate("index");
  });
  $(".navbar-default a").not(".logout").on('click', this.loadPage);
  $(".navbar-default a.logout").on('click', this.logout);
  this.$main.on("focus", "form input", function() {
    $(this).parents('.form-group').removeClass('has-error');
  });

  this.$sideBar.on('click', '.column', function() {
    GoodTimeApp.closeAllInfoWindows(GoodTimeApp.orderedMarkers);

    var id = $(this).data('markerId');
    var marker = _.findWhere(GoodTimeApp.orderedMarkers, { id: id });
    marker.infoWindow.open(GoodTimeApp.map, marker);
  });

  this.$sideBar.on('click', '.favorite', function(){
    var placeId = $(this).data('markerId');
    var marker = _.findWhere(GoodTimeApp.orderedMarkers, { id: placeId });
    GoodTimeApp.favoritePlace(marker);
    $(this).toggleClass("unfavorite");
  }); 

  this.$sideBar.on('click', 'button#draw-route', GoodTimeApp.mapSelections);

  this.$sideBar.on('click', '.info-button', function(){
   GoodTimeApp.closeAllInfoWindows(GoodTimeApp.markers);

   var id = $(this).data('markerId');
   var marker = _.findWhere(GoodTimeApp.markers, { id: id });
   marker.infoWindow.open(GoodTimeApp.map, marker);
  });


  this.$user.on('click', function() {
    GoodTimeApp.showUser();
  })

  $(document).on('click', '#clear-selections', function() {
    $('input[type=checkbox]').each(function() { 
      this.checked = false; 
    }); 
  })
}

GoodTimeApp.reset = function() {
  GoodTimeApp.closeAllInfoWindows(GoodTimeApp.orderedMarkers);
  this.markers = [];
  this.activityData = [];
  GoodTimeApp.directionsDisplay.setMap(null);
}

GoodTimeApp.markers = [];
GoodTimeApp.activityData = [];

GoodTimeApp.init = function() {
  
  this.$sideBar = $("#side-bar");
  this.$sideBar.hide();

  this.initEventHandlers();
  this.getTemplate("homepage");
  this.updateUI();
}.bind(GoodTimeApp);

document.addEventListener("DOMContentLoaded", function(){
  GoodTimeApp.init();
});
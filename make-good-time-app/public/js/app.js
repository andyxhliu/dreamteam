var GoodTimeApp = GoodTimeApp || {};

GoodTimeApp.API_URL = "http://localhost:3000/api";

GoodTimeApp.setRequestHeader = function(jqHXR) {
  var token = window.localStorage.getItem("token");
  if(!!token) return jqHXR.setRequestHeader('Authorization', 'Bearer ' + token);
}

GoodTimeApp.getTemplate = function(template, data) {
  return $.get('/templates/' + template + '.html').done(function(templateHtml) {
    var html = _.template(templateHtml)(data);
    GoodTimeApp.$main.html(html);
    GoodTimeApp.updateUI();
  });
}

// GoodTimeApp.addInfoWindowForActivity = function(activity, activityMarker) {
//   activityMarker.addListener('click', function() {

//     if(GoodTimeApp.infoWindow) GoodTimeApp.infoWindow.close();

//     GoodTimeApp.infoWindow = new google.maps.InfoWindow({
//       content: tbd
//     });

//     GoodTimeApp.infoWindow.open(GoodTimeApp.map, activityMarker);
//   });
// }

GoodTimeApp.createMarkerForActivity = function(activity) {
  console.log(activity.lat);
  console.log(activity.lng);
  var latLng = new google.maps.LatLng(activity.lat, activity.lng);
  console.log(latLng);
  var activityMarker = new google.maps.Marker({
    position: latLng,
    map: GoodTimeApp.map,
    icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  });
  // GoodTimeApp.addInfoWindowForActivity(activity, activityMarker);
}

GoodTimeApp.loopThroughActivities = function(data) {
  return data.forEach(GoodTimeApp.createMarkerForActivity);
}

GoodTimeApp.getActivities = function() {
  if(event) event.preventDefault();
  return $.ajax({
    method: "GET",
    url: "http://localhost:3000/api/activities"
  }).done(function(data) {
    GoodTimeApp.getTemplate("index", { activities: data });
    GoodTimeApp.loopThroughActivities( data );
  });
}

GoodTimeApp.handleForm = function() {
  event.preventDefault();

  $(this).find('button').prop('disabled', true);

  var data = $(this).serialize();
  var method = $(this).attr("method");
  var url = GoodTimeApp.API_URL + $(this).attr("action") ;


  return $.ajax({
    url: url,
    method: method,
    data: data,
    beforeSend: GoodTimeApp.setRequestHeader
  })
  .done(function(data) {
    if(!!data.token) {
      window.localStorage.setItem("token", data.token);
    }
    GoodTimeApp.getActivities();
  })
  .fail(GoodTimeApp.handleFormErrors);
}

GoodTimeApp.handleFormErrors = function(jqXHR) {
  var $form = $("form");
  for(field in jqXHR.responseJSON.errors) {
    $form.find("input[name=" + field + "]").parents('.form-group').addClass("has-error");
  }
  $form.find('button').removeAttr('disabled');
}

GoodTimeApp.loadPage = function() {
  event.preventDefault();
  GoodTimeApp.getTemplate($(this).data('template'));
}

GoodTimeApp.initEventHandlers = function() {
  this.$main = $("main");
  // $("a.navbar-brand").on('click', this.getActivities);
  this.$main.on("submit", "form", this.handleForm);
  $(".navbar-nav a").not(".logout").on('click', this.loadPage);
  $(".navbar-nav a.logout").on('click', this.logout);
  this.$main.on("focus", "form input", function() {
    $(this).parents('.form-group').removeClass('has-error');
  })
}

GoodTimeApp.logout = function() {
  event.preventDefault();
  window.localStorage.clear();
  GoodTimeApp.getTemplate("homepage");
  GoodTimeApp.updateUI();
}

GoodTimeApp.updateUI = function() {
  var loggedIn = !!window.localStorage.getItem("token");

  if(loggedIn) {
    $('.logged-in').removeClass("hidden");
    $('.logged-out').addClass("hidden");
  } else {
    $('.logged-in').addClass("hidden");
    $('.logged-out').removeClass("hidden");
  }
}

GoodTimeApp.initializeMap = function() {
  console.log("loading map");

  // Arbitrary starting point
  this.latLng = { lat: 51.5080072, lng: -0.1019284 };

  // Position map within #map div
  this.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: this.latLng
  });

  this.getActivities();

  // Place marker on map at load time
  this.startMark = new google.maps.Marker({
    position: this.latLng,
    map: this.map,
    title: 'You are here.'
  });

  // Include transit lines
  this.transitLayer = new google.maps.TransitLayer();
  this.transitLayer.setMap(this.map);

  // HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      GoodTimeApp.map.setCenter(pos);
      GoodTimeApp.startMark.setPosition(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

}

GoodTimeApp.init = function() {
  this.initializeMap();
  this.initEventHandlers();
  this.getTemplate("homepage");
  this.updateUI();
}.bind(GoodTimeApp);


$(GoodTimeApp.init);


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

GoodTimeApp.addInfoWindowForActivity = function(activity, activityMarker) {
  activityMarker.addListener('click', function() {

    var iwOuter = $('.gm-style-iw');
    var iwBackground = iwOuter.prev();
    iwBackground.children(':nth-child(2)').css({'display' : 'none!important'});
    iwBackground.children(':nth-child(4)').css({'display' : 'none!important'});

    if(GoodTimeApp.infoWindow) GoodTimeApp.infoWindow.close();

    GoodTimeApp.infoWindow = new google.maps.InfoWindow({
      content: '<div id="iw-container">' +
                        '<div class="iw-title">'+activity.name+'</div>' +
                        '<div class="iw-content">' +
                          '<img src="'+ activity.photo +'" height="200" width="200">' +
                          '<p>'+ activity.description + '(' + activity.postcode + ')</p>' +
                          '<div class="iw-subTitle">Contacts</div>' +
                          '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>'+
                          '<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>'+
                        '</div>' +
                        '<div class="iw-bottom-gradient"></div>' +
                      '</div>',
      maxWidth: 350
    });
    GoodTimeApp.infoWindow.open(GoodTimeApp.map, activityMarker);
  });
}

filterMarkers = function (category) {
  // if(event) event.preventDefault();
  // return $.ajax({
  //   method: "GET",
  //   url: "http://localhost:3000/api/activities"
  // }).done(function(data) {
  //   GoodTimeApp.getTemplate("index", { activities: data });
  //   GoodTimeApp.filterActivities( data );
  // });
  console.log(gmarkers1);
  for (i = 0; i < gmarkers1.length; i++) {
    marker = gmarkers1[i];
    // If is same category or category not picked
    if (marker.categories.join(" ").includes(category) || category.length === 0) {
        marker.setVisible(true);
    }
    else if (category === "0") {
      marker.setVisible(false);
    }
    // Categories don't match 
    else {
        marker.setVisible(false);
    }
  }
}

// GoodTimeApp.filterActivity = function(data) {
//   return data.forEach(GoodTimeApp.createMarkerForFilteredActivity);
// }

// GoodTimeApp.createMarkerForFilteredActivity = function(activity) {

// }
var gmarkers1 = [];

GoodTimeApp.createMarkerForActivity = function(activity) {
  var latLng = new google.maps.LatLng(activity.lat, activity.lng);
  var categories = activity.categories;
  var activityMarker = new google.maps.Marker({
    position: latLng,
    map: GoodTimeApp.map,
    categories: categories,
    icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  });
  gmarkers1.push(activityMarker);
  activityMarker.setVisible(false);

  GoodTimeApp.addInfoWindowForActivity(activity, activityMarker);
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
  this.$option = $("#filters :checkbox");
  this.$option.on("click", function() {
    return this.value
  })
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

// GoodTimeApp.addFilterListener = function() {
//   $("#filters :checkbox").click(function() {
//     console.log("Hello world");
//   });
// }

GoodTimeApp.initializeMap = function() {
  console.log("loading map");

  // Arbitrary starting point
  this.latLng = { lat: 51.5080072, lng: -0.1019284 };

  // Position map within #map div
  this.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: this.latLng
  });

  // this.addFilterListener();

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
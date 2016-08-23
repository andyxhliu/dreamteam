var GoodTimeApp = GoodTimeApp || {};

GoodTimeApp.addInfoWindowForActivity = function(activity, activityMarker) {
  activityMarker.addListener('click', function() {

    if(GoodTimeApp.infoWindow) GoodTimeApp.infoWindow.close();

    GoodTimeApp.infoWindow = new google.maps.InfoWindow({
      content: '<div>' + '<div>' + activity.name + '</div>' + '<div>' + 
      '<img src="'+ activity.photo + '" height="200" width="200">' + 
      '<p>'+ activity.description + '</p>' + 
      '<p>' + activity.location + ', ' + activity.postcode + '</p>'+ '</div>' + '</div>'
    });
    GoodTimeApp.infoWindow.open(GoodTimeApp.map, activityMarker);
  });
}

GoodTimeApp.filterMarkers = function (category) {
  for (i = 0; i < GoodTimeApp.markers.length; i++) {
    marker = GoodTimeApp.markers[i];
    if (marker.categories.join(" ").includes(category) || category.length === 0) {
      this.correctMarkers.push(marker);
    }
  }
}

GoodTimeApp.submitMarkers = function() {
  this.$filterBox = $(".filter-box");
  this.$filterBox.hide();
  this.$sideBar.show();
  for (i = 0; i < this.correctMarkers.length; i++) {
    marker = this.correctMarkers[i];
    marker.setVisible(true);
    GoodTimeApp.$sideBar.append("<div>\
      <li>\
        <label>\
          <input type='checkbox' data-marker-id='"+ marker.id + "' checked />\
          " + marker.name + "\
        </label>\
      </li>\
    </div>");
  }
  GoodTimeApp.$sideBar.append("<div>\
    <button type='button' id='draw-route'>Change</button>\
  </div>");
}


GoodTimeApp.createMarkerForActivity = function(activity) {
  var latLng = new google.maps.LatLng(activity.lat, activity.lng);
  var categories = activity.categories;
  var name = activity.name;
  var location = activity.location;
  var now = new Date();
  var activityMarker = new google.maps.Marker({
    id: activity._id,
    name: name,
    location: location,
    position: latLng,
    map: GoodTimeApp.map,
    categories: categories,
    icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  });
  GoodTimeApp.markers.push(activityMarker);
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

GoodTimeApp.getDirections = function() {
  this.waypoints = [];
  // console.log(this.correctMarker);
  // console.log(this.waypoints);
  for (var i=0; i < this.correctMarkers.length; i++) {
    GoodTimeApp.waypoints.push({"location": GoodTimeApp.correctMarkers[i].position});
  }
  console.log(this.waypoints);
  this.calcRoute();
}

GoodTimeApp.calcRoute = function(directionsService, directionsDisplay) {
  this.start = new google.maps.LatLng(51.540805, -0.1);
  this.request = {
    origin: this.start,
    destination: this.start,
    waypoints: this.waypoints,
    travelMode: 'WALKING' }

    GoodTimeApp.directionsService.route(this.request, function(response, status) {
      if (status == 'OK') {
        GoodTimeApp.directionsDisplay.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('side-bar');
        summaryPanel.innerHTML = '';
        
        for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
              '</b><br>';
          summaryPanel.innerHTML += 'to ' + route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].duration.text + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }
        console.log(response.routes[0].legs[1].duration.text);
      }
    });     
}

GoodTimeApp.initializeMap = function() {

  this.directionsDisplay = new google.maps.DirectionsRenderer();

  this.directionsService = new google.maps.DirectionsService();

  // Arbitrary starting point
  GoodTimeApp.latLng = { lat: 51.5080072, lng: -0.1019284 };

  // Position map within #map div
  GoodTimeApp.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: GoodTimeApp.latLng,
    mapTypeControl: false,
    styles: [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]
  });

  // this.addFilterListener();

  GoodTimeApp.getActivities();

  // Place marker on map at load time
  GoodTimeApp.startMark = new google.maps.Marker({
    position: GoodTimeApp.latLng,
    map: GoodTimeApp.map,
    title: 'You are here.'
  });

  // Include transit lines
  // GoodTimeApp.transitLayer = new google.maps.TransitLayer();
  // GoodTimeApp.transitLayer.setMap(this.map);

  // HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
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
  // GoodTimeApp.calcRoute();
  GoodTimeApp.directionsDisplay.setMap(GoodTimeApp.map);
}

var GoodTimeApp = GoodTimeApp || {};

GoodTimeApp.closeAllInfoWindows = function(markers) {
  markers.forEach(function(marker) {
    if(marker.infoWindow) marker.infoWindow.close();
  });
}

GoodTimeApp.addInfoWindowForActivity = function(activity, activityMarker) {

  activityMarker.addListener('click', function() {
    GoodTimeApp.closeAllInfoWindows(GoodTimeApp.markers);
    activityMarker.infoWindow.open(GoodTimeApp.map, activityMarker);
  });
}

GoodTimeApp.getPlaces = function(category, location) {
  return new Promise(function(resolve, reject) {
    GoodTimeApp.placesService.nearbySearch({
      location: location,
      radius: 1500,
      type: category,
    }, function(results, status) {
      if(status !== "OK") return reject(status);
      return resolve(results);
    });
  });
}

GoodTimeApp.submitMarkers = function() {

  GoodTimeApp.chosenCategoryIds = $('#filters').find('input:checked').toArray().map(function(category) {
    return $(category).data("categoryId");
  });

  // ["museum", "bars"]

  var location = GoodTimeApp.map.getCenter();

  var searchPromises = GoodTimeApp.chosenCategoryIds.map(function(category) {
    return GoodTimeApp.getPlaces(category, location);
  });

  // [museumPromise, barsPromise]

  Promise.all(searchPromises)
    .then(function(resultsArray) {
      resultsArray.forEach(function(results, index) {
        var category = GoodTimeApp.chosenCategoryIds[index];
        var markers = [];

        // create marker for each result
        results.forEach(function(result) {
          if (result.rating > 4.1 ) {
            
            var photo = result.photos ? result.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) : null;

            var data = {
              id: result.place_id,
              name: result.name,
              categories: result.types.join(" "),
              location: result.vicinity,
              latLng: result.geometry.location,
              rating: result.rating,
              photo: photo
            };
            
            GoodTimeApp.activityData.push(data);
            markers.push(GoodTimeApp.createMarkerForActivity(data));
          }
        });

        GoodTimeApp.appendMarker(category, markers);

      });

      GoodTimeApp.$sideBar.append("<div>\
        <button type='button' id='draw-route' class='btn'>Change</button>\
      </div>");
      GoodTimeApp.$sideBar.append("<h4 class='error hidden'>Maximum 8 activites per day!</h4>");

      
    })
    .catch(function(error) {
      console.error(error);
    });
}

GoodTimeApp.geocoder = new google.maps.Geocoder();

GoodTimeApp.getPlaceById = function(placeId) {
  return new Promise(function(resolve, reject) {
    GoodTimeApp.geocoder.geocode({ placeId: placeId }, function(results, status) {
      if(status !== "OK") return reject(status);
      
      var activity = {
        id: results[0].place_id,
        name: results[0].address_components[0].long_name,
        categories: results[0].types.join(" "),
        location: results[0].formatted_address,
        latLng: results[0].geometry.location
      };

      resolve(activity);
    });
  });
}

GoodTimeApp.createMarkerForActivity = function(activity) {
  GoodTimeApp.a ++;
  var latLng = activity.latLng;
  var categories = activity.categories;
  var name = activity.name;
  var id = activity.id;
  var rating = activity.rating;
  var location = activity.location;

  var activityMarker = new google.maps.Marker({
    id: id,
    name: name,
    location: location,
    position: latLng,
    map: GoodTimeApp.map,
    rating: rating,
    categories: categories,
    icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    photo: activity.photo
  });

  activityMarker.infoWindow = new google.maps.InfoWindow({
    content: '<div>\
      <div>' + activity.name + '</div>\
      <div>' + (activity.photo ? '<img src="'+ activity.photo + '" height="200" width="200">' : '') +
        '<p>' + activity.location + ', ' + '</p>\
      </div>\
    </div>'
  });
  
  activityMarker.setVisible(false);
  GoodTimeApp.addInfoWindowForActivity(activity, activityMarker);

  return activityMarker;
}

GoodTimeApp.sentenceCase = function(string) {
  return string.replace('_', ' ').split(' ').map(function(s) {
    return s[0].toUpperCase() + s.slice(1)
  }).join(' ');
}

GoodTimeApp.appendMarker = function(category, markers) {
  this.$filterBox = $(".filter-box");
  this.$sideBar = $("#side-bar");
  this.$filterBox.hide();
  this.$sideBar.show();

  GoodTimeApp.$sideBar.append('<h4>' + GoodTimeApp.sentenceCase(category) + '</h4>');

  for (i = 0; i < markers.length; i++) {
    marker = markers[i];
    
    marker.setVisible(true);
    GoodTimeApp.$sideBar.append("<div>\
      <li>\
        <label>\
          <input type='checkbox' data-marker-id='"+ marker.id + "' checked />\
          " + marker.name + "\
        </label>\
        <button class='info-button' data-marker-id='"+ marker.id +"'>Infos</button>\
      </li>\
    </div>");

    GoodTimeApp.markers.push(marker);
  }
  
}

GoodTimeApp.orderRoute = function() {
  var startingPoint = new google.maps.LatLng(GoodTimeApp.pos.lat, GoodTimeApp.pos.lng);
  this.waypoints = [];
  this.distances = [];
  this.orderedMarkers = [];
  //CALCULATE DISTANCE FROM THE FIRST MARKER
  this.markers.forEach(function(marker) {  
    GoodTimeApp.distances.push({
      distance: google.maps.geometry.spherical.computeDistanceBetween(startingPoint, marker.getPosition()),
      marker: marker
    });   
  });

  //RECALCULATE FROM A NEW MARKER
  startingPoint = marker.getPosition();
  //FIND THE NEAREST MARKER
  GoodTimeApp.distances.sort(function(a,b) {
    return a.distance - b.distance;
  });
  GoodTimeApp.distances.forEach(function(distance) {
    GoodTimeApp.orderedMarkers.push(distance.marker);
  })
  this.waypoints.push( {location: GoodTimeApp.distances[0].marker.getPosition()} )
  //GET RID OF THE PREVIOUS MARKER FROM THE ARRAY
  GoodTimeApp.distances.shift();
    
  for (var i = 0; i < this.markers.length-1 ; i++) {
    var data = ({
      distance: google.maps.geometry.spherical.computeDistanceBetween(startingPoint, marker.getPosition()),
      marker: marker
    });
    startingPoint = marker.getPosition();
    GoodTimeApp.distances.sort(function(a,b) {
      return a.distance - b.distance;
    });
    this.waypoints.push( {location: GoodTimeApp.distances[0].marker.getPosition()} )
    GoodTimeApp.distances.shift();
  }

  this.calcRoute();
}


GoodTimeApp.calcRoute = function(directionsService, directionsDisplay) {
  this.orderedMarkersLength = this.orderedMarkers.length-1;
  this.start = new google.maps.LatLng(GoodTimeApp.pos.lat, GoodTimeApp.pos.lng);
  this.request = {
    origin: this.start,
    destination: GoodTimeApp.orderedMarkers[GoodTimeApp.orderedMarkersLength].getPosition(),
    waypoints: this.waypoints,
    travelMode: 'WALKING' }

    GoodTimeApp.directionsService.route(this.request, function(response, status) {
      if (status == 'OK') {
        GoodTimeApp.directionsDisplay.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('side-bar');
        summaryPanel.innerHTML = '';

        for (var i = 0; i < route.legs.length-1; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += 
          '<button class="favorite" data-marker-id="'+ GoodTimeApp.orderedMarkers[i].id +'">Save to favorite</button>\
          <div class="column" data-marker-id="'+ GoodTimeApp.orderedMarkers[i].id + '">\
            <b>' + routeSegment +': ' + GoodTimeApp.orderedMarkers[i].name + '</b><br>\
            to ' + route.legs[i].end_address + '<br>' + 
            route.legs[i].duration.text + '<br>' +
            route.legs[i].distance.text + '<br><br>\
          </div>';

        }
      }
    });     
}


GoodTimeApp.mapSelections = function() {
  GoodTimeApp.markerIds = GoodTimeApp.$sideBar.find('input:checked').toArray().map(function(checkbox) {
    return $(checkbox).data('markerId');
  });

  if (GoodTimeApp.markerIds.length > 8) {
    return GoodTimeApp.$sideBar.find('.error').removeClass('hidden');
  } else {
    GoodTimeApp.$sideBar.find('.error').addClass('hidden');
    GoodTimeApp.markers = GoodTimeApp.markers.filter(function(marker) {

      if(GoodTimeApp.markerIds.indexOf(marker.id) !== -1) {
        return true;
      } else {
        marker.setMap(null);
        return false;
      }
    });

    GoodTimeApp.orderRoute();
  }
}

GoodTimeApp.initializeMap = function() {

  this.directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true
  });

  this.directionsService = new google.maps.DirectionsService();

  // Position map within #map div
  GoodTimeApp.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: { lat: 51.5152701, lng: -0.0760154 },
    mapTypeControl: false,
    styles: [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]
  });

  GoodTimeApp.placesService = new google.maps.places.PlacesService(GoodTimeApp.map);

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
      GoodTimeApp.pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      GoodTimeApp.map.setCenter(GoodTimeApp.pos);
      GoodTimeApp.startMark.setPosition(GoodTimeApp.pos);
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
var GoodTimeApp = GoodTimeApp || {};

GoodTimeApp.closeAllInfoWindows = function(markers) {
  markers.forEach(function(marker) {
    if(marker.infoWindow) marker.infoWindow.close();
  });
}

GoodTimeApp.addInfoWindowForActivity = function(activity, activityMarker) {

  activityMarker.addListener('click', function() {
    GoodTimeApp.closeAllInfoWindows(GoodTimeApp.correctMarkers);
    activityMarker.infoWindow.open(GoodTimeApp.map, activityMarker);
  });
}

// GoodTimeApp.filterMarkers = function (category) {
//   console.log(category);
//   for (i = 0; i < GoodTimeApp.activityData.length; i++) {
//     data = GoodTimeApp.activityData[i];
//     if (data.categories.join(" ").includes(category) || category.length === 0) {
//       GoodTimeApp.createMarkerForActivity(data);
//     }
//   }
//   GoodTimeApp.markers.forEach(function(marker) {
//     GoodTimeApp.correctMarkers.push(marker);
//   })
// }

GoodTimeApp.submitMarkers = function() {

  var chosenCategoryIds = $('#filters').find('input:checked').toArray().map(function(category) {
    return $(category).data("categoryId");
  });

  console.log(chosenCategoryIds.join(" "));

  var service = new google.maps.places.PlacesService(this.map);
  service.nearbySearch({
    location: GoodTimeApp.map.getCenter(),
    radius: 500,
    type: chosenCategoryIds,
  }, function(results, status) {
    console.log(results);
    results.forEach(function(result) {
      if (result.rating > 4.1 ) {
        GoodTimeApp.activityData.push({
          id: result.id,
          name: result.name,
          location: result.vicinity,
          categories: chosenCategoryIds,
          latLng: result.geometry.location,
          rating: result.rating,
          photo: result.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 })
        })
      } 
    })
    console.log("Heres activity", GoodTimeApp.activityData);
    GoodTimeApp.a = 1;
    for (var i = 0; i < GoodTimeApp.activityData.length; i++) {
      GoodTimeApp.createMarkerForActivity(GoodTimeApp.activityData[i]);
    }
    GoodTimeApp.appendMarker();
  });
}

GoodTimeApp.createMarkerForActivity = function(activity) {
  GoodTimeApp.a ++;
  console.log(GoodTimeApp.a);
  console.log("in createMarkerForActivity");
  console.log(activity);
  var latLng = activity.latLng;
  var categories = activity.categories;
  var name = activity.name;
  var id = activity.id;
  var location = activity.location;

  var activityMarker = new google.maps.Marker({
    id: id,
    name: name,
    location: location,
    position: latLng,
    map: GoodTimeApp.map,
    categories: categories,
    icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  });

  console.log(activityMarker);

  activityMarker.infoWindow = new google.maps.InfoWindow({
    content: '<div>' + '<div>' + activity.name + '</div>' + '<div>' + 
    '<img src="'+ activity.photo + '" height="200" width="200">' + 
    '<p>' + activity.location + ', ' + '</p>'+ '</div>' + '</div>'
  });

  GoodTimeApp.markers.push(activityMarker);
  console.log(GoodTimeApp.markers);
  console.log(GoodTimeApp.markers[0].categories);
  activityMarker.setVisible(false);

  GoodTimeApp.addInfoWindowForActivity(activity, activityMarker);


}


GoodTimeApp.appendMarker = function() {
  this.$filterBox = $(".filter-box");
  this.$sideBar = $("#side-bar");
  this.$filterBox.hide();
  this.$sideBar.show();


  for (i = 0; i < GoodTimeApp.markers.length; i++) {
    marker = GoodTimeApp.markers[i];
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
  
  GoodTimeApp.markers.forEach(function(marker) {
    GoodTimeApp.correctMarkers.push(marker);
  })
}
// GoodTimeApp.loopThroughActivities = function(data) {
//   console.log("in loo throuh")
//   console.log(data);
//   return data.forEach(GoodTimeApp.createMarkerForActivity);
// }

// GoodTimeApp.getActivities = function() {
//   if(event) event.preventDefault();
//   return $.ajax({
//     method: "GET",
//     url: "http://localhost:3000/api/activities"
//   }).done(function(data) {
//     console.log(data);
//     GoodTimeApp.getTemplate("index", { activities: data });
//     GoodTimeApp.loopThroughActivities( data );
//   });
// }

GoodTimeApp.orderRoute = function() {
  var startingPoint = new google.maps.LatLng(GoodTimeApp.pos.lat, GoodTimeApp.pos.lng);
  this.waypoints = [];
  this.distances = [];
  this.orderedMarkers = [];
  this.markerLength = this.correctMarkers.length;
  console.log(GoodTimeApp.correctMarkers);
  this.correctMarkers.forEach(function(marker) {  
    var data = ({
      distance: google.maps.geometry.spherical.computeDistanceBetween(startingPoint, marker.getPosition()),
      marker: marker
    });

    startingPoint = marker.getPosition();
    GoodTimeApp.distances.push(data);     
  });

  GoodTimeApp.distances.sort(function(a,b) {
    return a.distance - b.distance;
  });

  GoodTimeApp.distances.forEach(function(distance) {
    GoodTimeApp.orderedMarkers.push(distance.marker);
  })
  console.log(GoodTimeApp.distances);
  this.waypoints.push( {location: GoodTimeApp.distances[0].marker.getPosition()} )
  GoodTimeApp.distances.shift();
    
  for (var i = 0; i < this.markerLength-1 ; i++) {
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
  console.log(GoodTimeApp.orderedMarkers[GoodTimeApp.orderedMarkersLength])
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
        console.log(route.legs);
        for (var i = 0; i < route.legs.length-1; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += '<div class="column" data-marker-id="'+ GoodTimeApp.orderedMarkers[i].id + '">\
            <b>' + routeSegment +': ' + GoodTimeApp.orderedMarkers[i].name + '</b><br>\
            to ' + route.legs[i].end_address + '<br>' + 
            route.legs[i].duration.text + '<br>' +
            route.legs[i].distance.text + '<br><br>\
          </div>';
        }
      }
    });     
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

  // var service = new google.maps.places.PlacesService(this.map);
  // service.nearbySearch({
  //   location: GoodTimeApp.map.getCenter(),
  //   radius: 500,
  //   type: ['bar']
  // }, function(results, status) {
  //   results.forEach(function(result) {
  //     if (result.rating > 4.1 ) {
  //       GoodTimeApp.activityData.push({
  //         id: result.id,
  //         name: result.name,
  //         location: result.vicinity,
  //         categories: ["Bars"],
  //         latLng: result.geometry.location,
  //         rating: result.rating,
  //         photo: result.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 })
  //       })
  //     } 
  //   })
  //   console.log(GoodTimeApp.activityData);

  // });

  // GoodTimeApp.getActivities();

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
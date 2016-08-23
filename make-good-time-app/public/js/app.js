var GoodTimeApp = GoodTimeApp || {};

GoodTimeApp.API_URL = "http://localhost:3000/api";

GoodTimeApp.getTemplate = function(template, data) {
  return $.get('/templates/' + template + '.html').done(function(templateHtml) {
    if (template !== 'index') {
      $('#map').hide();
    } else {
      $('#map').show();
    }
    if (template === 'homepage') {
      $('#brand-header').hide();
    } else {
      $('#brand-header').show();
    }
    if (template !== 'index') {
      $('#side-bar').hide();
    }

    var html = _.template(templateHtml)(data);
    GoodTimeApp.$main.html(html);
    GoodTimeApp.updateUI();
  });
}

GoodTimeApp.loadPage = function() {
  event.preventDefault();
  GoodTimeApp.getTemplate($(this).data('template'));
}

GoodTimeApp.initEventHandlers = function() {
  this.$column = $(".column");
  this.$main = $("main");
  this.$option = $("#filters :checkbox");
  this.$option.on("click", function() {
    return this.value
  })
  this.$main.on("submit", "form", this.handleForm);
  $(document).on('click', '#show-map', function() {
    GoodTimeApp.getTemplate("index");
    GoodTimeApp.initializeMap();
  });
  $(".navbar-nav a").not(".logout").on('click', this.loadPage);
  $(".navbar-nav a.logout").on('click', this.logout);
  this.$main.on("focus", "form input", function() {
    $(this).parents('.form-group').removeClass('has-error');
  });

  this.$sideBar.on('click', '.column', function() {
    console.log("hello");
    // if(GoodTimeApp.infoWindow) GoodTimeApp.infoWindow.close();
    // GoodTimeApp.infoWindow.open();
  })

  this.$sideBar.on('click', 'button#draw-route', function() {
    var markerIds = GoodTimeApp.$sideBar.find('input:checked').toArray().map(function(checkbox) {
      return $(checkbox).data('markerId');
    });

    GoodTimeApp.correctMarkers = GoodTimeApp.correctMarkers.filter(function(marker) {
      if(markerIds.indexOf(marker.id) !== -1) {
        return true;
      } else {
        marker.setMap(null);
        return false;
      }
    });
    GoodTimeApp.orderRoute();
  });
}


GoodTimeApp.init = function() {
  this.$sideBar = $("#side-bar");
  this.$sideBar.hide();
  this.markers = [];
  this.correctMarkers = [];
  // this.toDeleteMarker = [];
  // this.toAddMarker = [];
  this.initEventHandlers();
  this.getTemplate("homepage");
  this.updateUI();
}.bind(GoodTimeApp);

document.addEventListener("DOMContentLoaded", function(){
  GoodTimeApp.init();
});
var GoodTimeApp = GoodTimeApp || {};

GoodTimeApp.API_URL = "http://localhost:3000/api";

GoodTimeApp.getTemplate = function(template, data) {
  return $.get('/templates/' + template + '.html').done(function(templateHtml) {
    if (template !== 'index') {
      $('#map').hide();
      $('#main-nav').css('background-color', 'transparent');
    } else {
      $('#map').show();
      $('#main-nav').css('background-color', 'rgba(255,255,255,0.6)');
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

/////////////////////////

GoodTimeApp.getUsers = function(){
  return $.ajax({
    method: "GET",
    url: GoodTimeApp.API_URL
    }).done(function(data) {
      GoodTimeApp.getTemplate("show", { users: data });
    });
}

GoodTimeApp.saveFavorite = function(marker) {
  event.preventDefault();

  console.log("Works");
  // $(this).find('button').prop('disabled', true);
  var method = "PUT";
  var url = GoodTimeApp.API_URL;

  if("PUT" === method) { 
    var id = marker.id;
    url += id;
  }

  return $.ajax({
    url: url,
    method: method,
    data: marker
  })
  .done()
  .fail();               
}




///////////////////////////


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
  });
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
    GoodTimeApp.closeAllInfoWindows(GoodTimeApp.orderedMarkers);

    var id = $(this).data('markerId');
    var marker = _.findWhere(GoodTimeApp.orderedMarkers, { id: id });
    marker.infoWindow.open(GoodTimeApp.map, marker);
  });

  this.$sideBar.on('click', '.favorite', function(){
    var id = $(this).data('markerId');
    var marker = _.findWhere(GoodTimeApp.orderedMarkers, { id: id });
    GoodTimeApp.saveFavorite(marker);
    // console.log(marker.id);
    // console.log(marker.location);
  }); 

  this.$sideBar.on('click', 'button#draw-route', GoodTimeApp.mapSelections);
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
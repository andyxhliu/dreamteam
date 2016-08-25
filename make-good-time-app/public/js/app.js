var GoodTimeApp = GoodTimeApp || {};

GoodTimeApp.API_URL = "http://localhost:3000/api";

GoodTimeApp.getTemplate = function(template, data) {
  return $.get('/templates/' + template + '.html').done(function(templateHtml) {
    if (template !== 'index') {
      GoodTimeApp.activityData = [];
      GoodTimeApp.$sideBar.empty();
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
  this.$main.one("submit", "form", this.handleForm);
  $(document).on('click', '#show-map', function() {
    GoodTimeApp.getTemplate("index");
    GoodTimeApp.initializeMap();
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
    var id = $(this).data('markerId');
    // console.log(id);
    var marker = _.findWhere(GoodTimeApp.orderedMarkers, { id: id });
    console.log(marker);
    // console.log(marker.id);
    // console.log(marker.location);
  }); 

  this.$sideBar.on('click', 'button#draw-route', GoodTimeApp.mapSelections);

  $(document).on('click', '#clear-selections', function() {
    $('input[type=checkbox]').each(function() 
    { 
            this.checked = false; 
    }); 
  })
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
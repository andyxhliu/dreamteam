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
  })
}

GoodTimeApp.init = function() {
  this.$sideBar = $("#side-bar");
  this.$sideBar.hide();
  gmarkers1 = [];
  this.correctMarker = [];
  this.toDeleteMarker = [];
  this.toAddMarker = [];
  this.initEventHandlers();
  this.getTemplate("homepage");
  this.updateUI();
}.bind(GoodTimeApp);


$(GoodTimeApp.init);
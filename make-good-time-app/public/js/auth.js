var GoodTimeApp = GoodTimeApp || {};

GoodTimeApp.setRequestHeader = function(jqHXR) {
  var token = window.localStorage.getItem("token");
  if(!!token) return jqHXR.setRequestHeader('Authorization', 'Bearer ' + token);
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
      console.log("data is", data);
    }
    // GoodTimeApp.getActivities();
      // GoodTimeApp.getUser();
      GoodTimeApp.getTemplate("index");
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
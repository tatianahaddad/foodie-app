"use strict";

const apiKey = "611c404120c14c7fd146cee735612ea2";

const searchURL = "https://developers.zomato.com/api/v2.1/";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${key}=${params[key]}`);
  return queryItems.join("&");
}

function displayResults(responseJson) {
  console.log(responseJson);
  $("#js-error-message").empty();
  $("#results-list").empty();
  for (let i = 0; i < responseJson.length; i++) {
    $("#results-list").append(
      `<button type="button" class="button" data-id="${responseJson[i].id}">${
        responseJson[i].name}<a href="results-button"></a></button>`
    );
  }

  //display the results section
  $("#results").removeClass("hidden");
  $("#header").removeClass("hidden-one");

}

function errorCity() {
  $("#results-list").empty();
  $("#results-list").append(`<h3>Sorry, no results were found. Please try again</h3>`);
  $("#results").removeClass("hidden");
}

function getCity(query) {
  const params = {
    q: query
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + "cities" + "?" + queryString;

  console.log(url, "url");

  /*const options = {
    headers: new Headers({
      "X-Zomato-API-Key": apiKey,
      "Content-Type": "text/html",
    })
  };*/

  (function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();


var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var myObject = JSON.parse(this.responseText);
        displayResults(myObject.location_suggestions);
     }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader("X-Zomato-API-Key", apiKey);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("accept", "application/json");
  xhttp.send();


  /*fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (Object.keys(responseJson.location_suggestions).length !== 0) {
        return displayResults(responseJson.location_suggestions);
      }
      if (Object.keys(responseJson.location_suggestions).length === 0) {
        return errorCity();
      }
    });*/
}

function watchForm() {
  $("form").on('click', '#js-submit', function() {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    getCity(searchTerm);
    $("#js-search-term").val('');

  });
}

function displayRestaurants(responseJsonRestaurants) {
  console.log(responseJsonRestaurants.restaurants, "response text");
  $("#js-error-message").empty();
  $("#collection-list").empty();
  for (let i = 0; i < responseJsonRestaurants.restaurants.length; i++) {
    $("#collection-list").append(
      `<div class="results-border">
      <a href="${responseJsonRestaurants.restaurants[i].restaurant.events_url}" target="_blank"><h2 class="res-name">${responseJsonRestaurants.restaurants[i].restaurant.name}</h2>
        <h3>${responseJsonRestaurants.restaurants[i].restaurant.cuisines}</h3>
        <a href="${responseJsonRestaurants.restaurants[i].restaurant.events_url}" target="_blank"><img src="${responseJsonRestaurants.restaurants[i].restaurant.featured_image}" alt="Picture of ${responseJsonRestaurants.restaurants[i].restaurant.name}"></a>
        <h4 class="bottom-link">${responseJsonRestaurants.restaurants[i].restaurant.location.address}</h4>
      </div>`
    );
  }
  //display the results section
  $("#collection-results").removeClass("hidden");

}

function formatIdParams(idSearch) {
  console.log("working search");
  const queryId = Object.keys(idSearch).map(key => `${key}=${idSearch[key]}`);
  return queryId.join("&");
}

function getFood (entity_id) {
  const idSearch = {
    "entity_id" : entity_id,
    "entity_type" : "city"
  };

  const idQuery = formatIdParams(idSearch);
  const urlSearch = searchURL +  'search' + '?' + idQuery;

  console.log(urlSearch, "url");

  (function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();


  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        displayRestaurants(myObj);
     }
  };
  xhttp.open("GET", urlSearch, true);
  xhttp.setRequestHeader("X-Zomato-API-Key", apiKey);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("accept", "application/json");
  xhttp.send();

  /*$.ajax({
    type: 'GET',
    url: urlSearch,
    headers: {
      "X-Zomato-API-Key": apiKey,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    proxy: {
      host: '104.236.174.88',
      port: 3128
    },
    dataType: 'json'
    }).done(function(data) {
      displayRestaurants(data);
    });*/
}
// write a function that will handle the submit and retrieve the id from the city selected
function handleSelectCity() {
  console.log("running");
  $("#results-list").on("click", "button", function() {
    console.log("clicked");
    const entity_id = $(this).data("id");
    console.log(entity_id);
    getFood(entity_id);
  });
}


$(function() {
  console.log("ready!");
  watchForm();
  handleSelectCity();
  // getFood(handleSelectCity());
});

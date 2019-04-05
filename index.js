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
        responseJson[i].name}</button>`
    );
  }

  //display the results section
  $("#results").removeClass("hidden");
  $("#header").removeClass("hidden-one");

}

function errorCity() {
  $("#results-list").empty();
  $("#results-list").append(`<h3>Sorry, no results were found for that city. Please try again</h3>`);
  $("#results").removeClass("hidden");
}

function getCity(query, maxResults = 10) {
  const params = {
    q: query
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + "cities" + "?" + queryString;

  console.log(url, "url");

  const options = {
    headers: new Headers({
      "X-Zomato-API-Key": apiKey
    })
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (Object.keys(responseJson.location_suggestions).length !== 0) {
        return displayResults(responseJson.location_suggestions, maxResults);
      }
      if (Object.keys(responseJson.location_suggestions).length === 0) {
        return errorCity();
      }
    });
}

function watchForm() {
  $("form").on('click', '#js-submit', function() {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    const maxResults = $("#js-max-results").val();
    getCity(searchTerm, maxResults);
  });
}

function displayRestaurants(responseJsonRestaurants) {
  console.log(responseJsonRestaurants, "response text");
  $("#js-error-message").empty();
  $("#collection-list").empty();
  for (let i = 0; i < responseJsonRestaurants.length; i++) {
    $("#collection-list").append(
      `<h2>${responseJsonRestaurants[i].restaurant.name}</h2>
      <h2>${responseJsonRestaurants[i].name}</h2>
      <img src="${responseJsonRestaurants[i].name}">
      <a href="${responseJsonRestaurants[i].name}">${responseJsonRestaurants[i].collection.url}</a>`
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

function getFood (entity_id, maxResults = 10) {
  const idSearch = {
    "entity_id" : entity_id,
    "entity_type" : "city"
  };

  const idQuery = formatIdParams(idSearch);
  const urlSearch = searchURL +  'search' + '?' + idQuery;

  console.log(urlSearch, "url");

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        displayRestaurants(myObj);
        /*displayCollections(this.responseText);*/
     }
  };
  xhttp.open("GET", urlSearch, true);
  xhttp.setRequestHeader("X-Zomato-API-Key", apiKey);
  xhttp.send();
    /*.then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJsonRestaurants =>displayCollections(responseJsonRestaurants.restaurants, maxResults)
    )
    .catch(err => {
      $("#js-error-message").text(`No results found, try a different location!`);
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
// write a function that will retrieve the url https://developers.zomato.com/api/v2.1/collections and will use the
// id retrieved from the 'cities' search as a parameter



$(function() {
  console.log("ready!");
  watchForm();
  handleSelectCity();
  // getFood(handleSelectCity());
});

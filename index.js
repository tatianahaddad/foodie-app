"use strict";

const apiKey = "611c404120c14c7fd146cee735612ea2";

const searchURL = "https://developers.zomato.com/api/v2.1/";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${key}=${params[key]}`);
  return queryItems.join("&");
}

function displayResults(responseJson) {
  console.log(responseJson);
  $("#results-list").empty();
  /*let i = 0;
  const cities = Object.keys(responseJson[i]).map(function(city) {
    return `<li><h3>${responseJson[city]}</h3></li>`;
  });
  console.log(cities);*/
  for (let i = 0; i < responseJson.length; i++) {
    console.log(responseJson[i].name, "name of city");
    $("#results-list").append(
      `<button type="button" data-id="${responseJson[i].id}">${
        responseJson[i].name
      }</button>`
    );
  }
  //display the results section
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
    .then(responseJson =>
      displayResults(responseJson.location_suggestions, maxResults)
    )
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    const maxResults = $("#js-max-results").val();
    getCity(searchTerm, maxResults);
  });
}

function formatIdParams(idSearch) {
  console.log("working search");
  const queryId = Object.keys(idSearch).map(key => `${key}=${idSearch[key]}`);
  return queryId.join("&");
}
// $(watchForm);
function getFood (cityId) {
  const idSearch = {
    city_id : cityId
  };

  const idQuery = formatIdParams(idSearch);
  const urlSearch = searchURL +  'collections' + '?' + idQuery;

  console.log(urlSearch, "url");

  const options = {
    headers: new Headers({
      "X-Zomato-API-Key": apiKey
    })
  };

    fetch(urlSearch, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson =>(console.log(responseJson))
    )
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}
// write a function that will handle the submit and retrieve the id from the city selected
function handleSelectCity() {
  console.log("running");
  $("#results-list").on("click", "button", function() {
    console.log("clicked");
    const cityId = $(this).data("id");
    console.log(cityId);
    getFood(cityId);
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

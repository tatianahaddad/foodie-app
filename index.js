'use strict';

const apiKey = "611c404120c14c7fd146cee735612ea2"

const searchURL = "https://developers.zomato.com/api/v2.1/cities";


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  /*let i = 0;
  const cities = Object.keys(responseJson[i]).map(function(city) {
    return `<li><h3>${responseJson[city]}</h3></li>`;
  });
  console.log(cities);*/
  for (let i = 0; i < responseJson.length ; i++){
    console.log(responseJson[i].name, "name of city");
    $('#results-list').append(
      `<button type="button" id= "submits" value="${responseJson[i].id}">${responseJson[i].name}</button>`
    )};
  //display the results section
  $('#results').removeClass('hidden');
};

function getFood(query, maxResults=10) {
  const params = {
    q: query,
  };

  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url, "url");

  const options = {
    headers: new Headers({
      "X-Zomato-API-Key": apiKey})
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson.location_suggestions, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getFood(searchTerm, maxResults);
  });
}

$(watchForm);

/*write a function that will retrieve the url https://developers.zomato.com/api/v2.1/collections and will use the 
Id retrieved from the 'cities' search as a parameter
function handleSubmit()
  $('#submits').click(function(event) {
    responseCity();
  })
function responseCity()*/
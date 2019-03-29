const apiKey = "611c404120c14c7fd146cee735612ea2"

function getFood() {
  const url = "https://developers.zomato.com/api/v2.1/categories";
  
 const options = {
    headers: new Headers({
      "X-Zomato-API-Key": apiKey})
  };

  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => console.log(responseJson));
}

$(getFood);

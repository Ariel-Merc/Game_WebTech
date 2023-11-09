// 1
window.onload = (e) => { document.querySelector("#search").onclick = searchButtonClicked };

// 2
let displayTerm = "";

// 3
function searchButtonClicked() {
    console.log("searchButtonClicked() called");

    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";
    let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

    // build url string
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    // parse user entered term
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    // get rid of leading and trailing spaces
    term = term.trim();

    // encode spaces and special terms
    term = encodeURIComponent(term);

    // if no term to search, end function
    if (term.length < 1) return;

    // add the search term to the url
    url += "&q=" + term;

    // append user chosen search limit to the url
    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    // update the UI
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    // view the url
    console.log(url);

    // 12 Request data!
    getData(url);
}

function getData(url) {
    // Create new XHR object
    let xhr = new XMLHttpRequest();

    // set the onLoad handler
    xhr.onload = dataLoaded;

    // set onError handler
    xhr.onerror = dataError;

    // open connection and send the request
    xhr.open("Get", url);
    xhr.send();
}

// Callback functions
function dataLoaded(e) {
    // event.target is xhr object
    let xhr = e.target;

    // xhr.responseText is the JSON file we downloaded
    console.log(xhr.responseText);

    // turn the text into a parsable Javascript object
    let obj = JSON.parse(xhr.responseText);

    // if no results, print a message and return
    if (!obj.data || obj.data.length == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return;
    }

    // start building an html string to display to the user
    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "";

    // loop through array of results
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        // get the URL to the GIF
        let smallURL = result.images.fixed_width_downsampled.url;
        if (!smallURL) smallURL = "../images/no-image-found.png"

        // get the url to the GIPHY Page
        let url = result.url;

        // Build a <div> to hold each result
        let line = `<div class='result'><img src ='${smallURL}' title='${result.id}'/>`;
        line += `<span><a target='_blank' href='${url}'>View on Giphy</a> <p>Rating: ${result.rating.toUpperCase()}</span></div>`;

        // add the <div> to bigString and loop
        bigString += line;
    }

    // show the html to the user
    document.querySelector("#content").innerHTML = bigString;

    // update the status
    document.querySelector("#status").innerHTML =
        "<b>Success!</b> <p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function dataError(e) {
    console.log("An error occured");
}
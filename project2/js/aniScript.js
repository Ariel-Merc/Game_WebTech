// 1
window.onload = (e) => { 
    getPopular();
    getAttribute("genres");
    document.querySelector("#search").onclick = searchButtonClicked 
};

// 2
let displayTerm = "";
let testLog = ""

// 3
function searchButtonClicked() {
    console.log("searchButtonClicked() called");

    const JIKAN_URL = "https://api.jikan.moe/v4/anime?";

    // build url string
    let url = JIKAN_URL;

    // parse user entered term
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    // get rid of leading and trailing spaces
    term = term.trim();

    // encode spaces and special terms
    term = encodeURIComponent(term);

    // add the search term to the url
    if (term.length > 0) {
        url += "&q=" + term;
    };

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

function getPopular() {
    // Create new XHR object
    let xhr = new XMLHttpRequest();

    // set the onLoad handler
    xhr.onload = loadPopular;

    // set onError handler
    xhr.onerror = dataError;

    // open connection and send the request
    xhr.open("Get", "https://api.jikan.moe/v4/top/anime?&limit=10");
    xhr.send();
}

function loadPopular(e) {
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
        let smallURL = result.images.jpg.large_image_url;
        //if (!smallURL) smallURL = "../images/no-image-found.png"

        // get the url to the GIPHY Page
        let url = result.url;

        // Build a <div> to hold each result
        let line = `<div class='popimg'><img src ='${smallURL}'/></div>`;
        //line += `<span><a target='_blank' href='${url}'>View on Giphy</a> <p>Rating: ${result.rating.toUpperCase()}</span></div>`;

        // add the <div> to bigString and loop
        bigString += line;
    }

    // show the html to the user
    document.querySelector(".carouselCont").innerHTML = bigString;
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
        let smallURL = result.images.jpg.image_url;
        //if (!smallURL) smallURL = "../images/no-image-found.png"

        // get the url to the GIPHY Page
        let url = result.url;

        // Build a <div> to hold each result
        let line = `<div class='result'><a target='_blank' href='${result.url}'><img src ='${smallURL}' 
                     alt='${result.name} image'></a>`;
        line += `<span><p>Title: ${result.title}`;
        line += `<p>Rating: ${result.rating}</span>`;
        line += `<p>Score: ${result.score}</span></div>`;

        // add the <div> to bigString and loop
        bigString += line;
    }

    // show the html to the user
    document.querySelector("#content").innerHTML = bigString;

    // update the status
    document.querySelector("#status").innerHTML =
        "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function dataError(e) {
    console.log("An error occured");
}


function getAttribute(type) {
    let url = "https://api.jikan.moe/v4/"
    url += type;
    url += "/anime";

    // Create new XHR object 
    let xhr = new XMLHttpRequest();

    // set the onLoad handler
    xhr.onload = loadAttribute;

    // set onError handler
    xhr.onerror = dataError;

    // open connection and send the request
    xhr.open("Get", url);
    xhr.send();
}

function loadAttribute(e) {
    // event.target is xhr object
    let xhr = e.target;

    // xhr.responseText is the JSON file we downloaded
    console.log(xhr.responseText);

    // turn the text into a parsable Javascript object
    let obj = JSON.parse(xhr.responseText);

    // start building an html string to display to the user
    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "";

    // loop through array of results
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        // get the URL to the GIF
        let smallURL = result.name;

        // get the url to the GIPHY Page
        let url = result.url;

        // Build a <div> to hold each result
        let line = `<button type='button' id='search' class='${result.name}'>${result.name}</button>`;

        // add the <div> to bigString and loop
        bigString += line;
    }

    // show the html to the user
    document.querySelector(".filterButtons").innerHTML = bigString;
}

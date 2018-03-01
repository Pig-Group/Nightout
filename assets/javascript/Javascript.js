/* Global variables, CONST, and objects */
const TM_KEY = "Lpdy3vX87eDAFfSO7RcgKAaQZzL4rsRK";
const TM_SIZE = 25;
const TM_RADIUS = 53; // miles
var windowLatitude = "";
var windowLongitude = "";

//tmEvent
var tmEvent = function (id, name, url, genreName, startlocalDate, startlocalTime, distance, maxPrice, minPrice, currencyPrice, venuesAddress, venuesCity, venuesState, imageUrlSmall, imageUrlLarge,venuesLatitude,venuesLongitude) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.genreName = genreName;
    this.startlocalDate = startlocalDate;
    this.startlocalTime = startlocalDate;
    this.distance = distance;
    this.maxPrice = maxPrice;
    this.minPrice = minPrice;
    this.currencyPrice = currencyPrice;
    this.venuesAddress = venuesAddress;
    this.venuesCity = venuesCity;
    this.venuesState = venuesState;
    this.imageUrlSmall = imageUrlSmall;
    this.imageUrlLarge = imageUrlLarge;
    this.venuesLatitude=venuesLatitude;
    this.venuesLongitude=venuesLongitude;
}

var userInput = function (keyword, startDate, endDate, location, latitude, longitude) {
    this.keyword = keyword;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.latitude = latitude;
    this.longitude = longitude;
    this.geoPoint = function () {
        if (this.latitude === '' || this.latitude == null || this.longitude === '' || this.longitude == null) {
            return '';
        }
        else {
            return this.latitude + "," + this.longitude;
        }
    };
}

// Main functions are here
var getUserCoords = function () {
    if (localStorage.getItem("windowLatitude") === null || localStorage.getItem("windowLongitude") === null) {
        var latitude;
        var longitude;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                if (typeof (Storage) !== "undefined") {
                    localStorage.setItem("windowLatitude", latitude);
                    localStorage.setItem("windowLongitude", longitude);
                    windowLatitude = latitude;
                    windowLongitude = longitude;
                }
                else {
                    windowLatitude = latitude;
                    windowLongitude = longitude;
                }
            });
        }
        else {
            console.log("Your browser doesn't support geolocation.");
            alert("Your browser doesn't support geolocation.");
            var displayResults = $("#displayResults");
            var test = $("<h1>");
            test.html("Your browser doesn't support geolocation.");
            displayResults.html(test);
        }
    }
}
// this function using regular expression: city rturns TRUE
function isCity(location) {
    location = location.trim();
    var zipORCityText = new RegExp("^([0-9]{5}|[a-zA-Z][a-zA-Z ]{0,49})$");
    if (zipORCityText.test(location)) {
        if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(location)) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return null;
    }
}
function tmEventSearch(userInput) {
    var tmEventList = [];
    var rootUrl = "https://app.ticketmaster.com/discovery/v2/events.json?size=" + TM_SIZE + "&apikey=" + TM_KEY + "&radius=" + TM_RADIUS + "&unit=miles";
    var queryParameters = "";
    if (userInput.keyword !== '' && userInput.keyword != null) {
        queryParameters += "&keyword=" + userInput.keyword;
    }
    console.log(userInput.geoPoint());
    if (userInput.startDate !== '' && userInput.startDate != null) {
        var myDate = new Date(userInput.startDate);
        var newStartDate = myDate.toISOString().split('.')[0] + "Z";
        queryParameters += "&startDateTime=" + newStartDate;
    }
    if (userInput.endDate !== '' && userInput.endDate != null) {
        var myDate = new Date(userInput.endDate);
        var newEndtDate = myDate.toISOString().split('.')[0] + "Z";
        queryParameters += "&endDateTime=" + newEndtDate;
    }
    if (userInput.location !== '' && userInput.location != null) {
        if (isCity(userInput.location)) {
            queryParameters += "&city=" + userInput.location;
        }
        else if (!isCity(userInput.location) && isCity(userInput.location) != null) {
            queryParameters += "&postalCode=" + userInput.location;
        }
        else {
            if (userInput.geoPoint !== '' && userInput.geoPoint != null) {
                queryParameters += "&geoPoint=" + userInput.geoPoint();
            }
        }
    }
    else {
        if (userInput.geoPoint !== '' && userInput.geoPoint != null) {
            queryParameters += "&geoPoint=" + userInput.geoPoint();
        }
    }
    var queryUrl = rootUrl + queryParameters;
    console.log(queryUrl);
    $("#displayResults").empty();
    $.ajax({
        type: "GET",
        url: queryUrl,
        async: false,
        dataType: "JSON"
    }).done(function (response) {
        var countEvents = response.page.totalElements;
        var displayResults = $("#displayResults");
        if (countEvents === 0) {
            var test = $("<h1>");
            test.html("There is no events available!");
            displayResults.html(test);
            return false;
        }
        console.log(response);
        console.log("Number of events in your search is: " + countEvents);
        for (var i = 0; i < response._embedded.events.length; i++) {
            var id = response._embedded.events[i].id;
            var name = response._embedded.events[i].name;
            var url = response._embedded.events[i].url;
            if (response._embedded.events[i].hasOwnProperty("classifications")) {
                if (response._embedded.events[i].classifications.length > 0) {
                    if (response._embedded.events[i].classifications[0].hasOwnProperty("genre")) {
                        var genreName = response._embedded.events[i].classifications[0].genre.name;
                    }
                    else {
                        var genreName = "Unknown";
                    }
                }
            }
            else {
                var genreName = "Unknown";
            }
            var startlocalDate = response._embedded.events[i].dates.start.localDate;
            var startlocalTime = response._embedded.events[i].dates.start.localTime;
            var distance = response._embedded.events[i].distance;
            if (response._embedded.events[i].hasOwnProperty("priceRanges")) {
                if (response._embedded.events[i].priceRanges.length > 0) {
                    var maxPrice = response._embedded.events[i].priceRanges[0].max;
                    var minPrice = response._embedded.events[i].priceRanges[0].min;
                    var currencyPrice = response._embedded.events[i].priceRanges[0].currency;
                }
            }
            else {
                var maxPrice = "0.00";
                var minPrice = "0.00";
                var currencyPrice = "USD";
            }
            if (response._embedded.events[i]._embedded.hasOwnProperty("venues")) {
                if (response._embedded.events[i]._embedded.venues.length > 0) {
                    var venuesLongitude=response._embedded.events[i]._embedded.venues[0].location.longitude;
                    var venuesLatitude=response._embedded.events[i]._embedded.venues[0].location.latitude;
                    var venuesAddress = response._embedded.events[i]._embedded.venues[0].address.line1;
                    var venuesCity = response._embedded.events[i]._embedded.venues[0].city.name;
                    if (response._embedded.events[i]._embedded.venues[0].hasOwnProperty("state")) {
                        var venuesState = response._embedded.events[i]._embedded.venues[0].state.name;
                    }
                    else{
                        var venuesState = "TBA";     
                    }
                }
            }
            else {
                var venuesAddress = "TBA";
                var venuesCity = "TBA";
                var venuesState = "TBA";
            }
            if (response._embedded.events[i].hasOwnProperty("images")) {
                var sFlag = false;
                var lFlag = false;
                if (response._embedded.events[i].images.length > 0) {
                    for (var j = 0; j < response._embedded.events[i].images.length; j++) {
                        var width = response._embedded.events[i].images[j].width;
                        var height = response._embedded.events[i].images[j].height;
                        if (width < 250 && height < 100 && !sFlag) {
                            var imageUrlSmall = response._embedded.events[i].images[j].url;
                            sFlag = true;
                        }
                        if (width > 500 && height > 350 && height < 400 && !lFlag) {
                            var imageUrlLarge = response._embedded.events[i].images[j].url;
                            lFlag = true;
                        }
                    }
                    if (!sFlag) { var imageUrlSmall = "assets/images/PhotoNotAvailableSmall.jpg"; }
                    if (!lFlag) { var imageUrlLarge = "assets/images/PhotoNotAvailableLarge.jpg"; }
                }
                else {
                    var imageUrlSmall = "assets/images/PhotoNotAvailableSmall.jpg";
                    var imageUrlLarge = "assets/images/PhotoNotAvailableLarge.jpg";
                }
            }

            var tmEventSingle = new tmEvent(id, name, url, genreName, startlocalDate, startlocalTime, distance, maxPrice, minPrice, currencyPrice, venuesAddress, venuesCity, venuesState, imageUrlSmall, imageUrlLarge,venuesLatitude,venuesLongitude);


            tmEventList.push(tmEventSingle);
        }
    }); //end of .done ajax
    return tmEventList;

}
function displaySearchResult(tmEventList) {
    if (tmEventList.length === 0) { return false; }
    var displayResults = $("#displayResults");
    var tableTag = $("<table>");
    tableTag.addClass("pure-table");
    var tableHeaderTag = $("<tr><th>Image</th><th>Event Name</th><th>Date</th>");
    tableTag.append(tableHeaderTag);
    for (var i = 0; i < tmEventList.length; i++) {
        var tableRowTag = $("<tr>");
        var tableImageCell = $("<td>");
        var aTag = $("<a>");
        aTag.attr("id", tmEventList[i].id);
        aTag.addClass("idQueryString");
        aTag.attr("href", "event.html?id=" + tmEventList[i].id);
        var imageTag = $("<img>");
        imageTag.attr("src", tmEventList[i].imageUrlSmall);
        aTag.append(imageTag);
        tableImageCell.append(aTag);
        tableRowTag.append(tableImageCell);
        var tableNameCell = $("<td>");
        var aTag2 = $("<a>");
        aTag2.addClass("idQueryString");
        aTag2.attr("href", "event.html?id=" + tmEventList[i].id);
        tableNameCell.html("<h5>" + tmEventList[i].name + "</h5>");
        aTag2.append(tableNameCell);
        tableRowTag.append(aTag2);
        var tableDateCell = $("<td>");
        tableDateCell.html("<h5>" + tmEventList[i].startlocalDate + "</h5>");
        tableRowTag.append(tableDateCell);
        tableTag.append(tableRowTag);
    }
    displayResults.append(tableTag);
}
function retrieveData4EventDetailsPage() {
    var queryStringId = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var queryId = queryStringId[0].substring(3, queryStringId[0].length);
    var tmEventListObject = localStorage.getItem("tmEventListString");
    var tmEventList = JSON.parse(tmEventListObject);
    var index = 0;
    for (var i = 0; i < tmEventList.length; i++) {
        var objSingle = tmEventList[i];
        if (objSingle.id === queryId) {
            index = i;
            break;
        }
    }
    displayEventDetails(tmEventList[index]);
}

function displayEventDetails(tmEvent) {
    var imageHolder = $("#images");
    var aTag = $("<a>");
    aTag.attr("id", tmEvent.id);
    aTag.attr("target","_blank");
    aTag.attr("href", tmEvent.url);
    var imgTag = $("<img>");
    imgTag.attr("src", tmEvent.imageUrlLarge);
    aTag.append(imgTag);
    imageHolder.append(aTag);
    var listULholder = $("#listHolder")
    var eventName = $("<h4>")
    eventName.text(tmEvent.name);
    listULholder.append(eventName);
    var eventLocation = $("<h4>")
    eventLocation.html("Address: "+tmEvent.venuesAddress + "<span> | </span>" + tmEvent.venuesCity + "<span> | </span>" + tmEvent.venuesState);
    listULholder.append(eventLocation);
    var eventDate = $("<h4>")
    eventDate.text("Date: "+tmEvent.startlocalDate);
    listULholder.append(eventDate);
    var eventPrice = $("<h4>")
    eventPrice.html("Price: "+tmEvent.currencyPrice + " $" + tmEvent.minPrice + "<span> -- </span>" + tmEvent.maxPrice);
    listULholder.append(eventPrice);
    var purchaseTicket=$("#backButton");
    var btnPurchaseTicket=$("<button>");
    btnPurchaseTicket.attr("id","btnPurchase");
    btnPurchaseTicket.attr("data-url",tmEvent.url);
    btnPurchaseTicket.text("Purchase");
    btnPurchaseTicket.attr("type","submit");
    btnPurchaseTicket.addClass("pure-button pure-button-primary");
    purchaseTicket.append(btnPurchaseTicket);
}
function retrieveSearchResults4HomePage() {
    var queryStringId = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var queryId = queryStringId[0].substring(7, queryStringId[0].length);
    if (queryId === "true") {
        var tmEventListObject = localStorage.getItem("tmEventListString");
        var mytmEventList = JSON.parse(tmEventListObject);
        displaySearchResult(mytmEventList);
    }
}
$(document).ready(function () {
    var url = top.location.pathname;
    var fileName = url.substring(url.lastIndexOf("/") + 1);
    if (fileName === "event.html") {
        retrieveData4EventDetailsPage();
    }
    if (fileName === "index.html") {
        retrieveSearchResults4HomePage();
    }
});
$(document).on("click","#btnPurchase",buyTicket);
function buyTicket(){
    var url=$(this).attr("data-url");
    window.open(url,"_blank");
};
$("#btnBackSearch").on("click", function (event) {
    event.preventDefault();
    window.location.href = "index.html?reload=true";
});
$("#btnSubmit").on("click", function (event) {
    event.preventDefault();
    var keyword = $("#keyword").val().trim();
    var startDate = $("#startDate").val().trim();
    var endDate = $("#endDate").val().trim();
    var location = $("#location").val().trim();
    if (localStorage.getItem("windowLatitude") !== null || localStorage.getItem("windowLongitude") !== null) {
        var currentLatitude = localStorage.getItem("windowLatitude");
        var currentLongitude = localStorage.getItem("windowLongitude");
    }
    else {
        var currentLatitude = windowLatitude;
        var currentLongitude = windowLongitude;
    }
    var myUserInput = new userInput(keyword, startDate, endDate, location, currentLatitude, currentLongitude);
    var mytmEventList = tmEventSearch(myUserInput);
    if (localStorage.getItem("tmEventListString") === null) {
        var mytmEventListString = JSON.stringify(mytmEventList);
        localStorage.setItem("tmEventListString", mytmEventListString);
    }
    else {
        localStorage.removeItem("tmEventListString");
        var mytmEventListString = JSON.stringify(mytmEventList);
        localStorage.setItem("tmEventListString", mytmEventListString);
    }
    displaySearchResult(mytmEventList);

});
$("#btnReset").on("click", function (event) {
    event.preventDefault();
    $("#displayResults").empty();
    $("#keyword").val("");
    $("#startDate").val("");
    $("#endDate").val("");
    $("#location").val("");
    localStorage.removeItem("tmEventListString");
    window.location.href="index.html";
})
getUserCoords();
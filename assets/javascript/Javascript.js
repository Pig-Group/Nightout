/* Global variables, CONST, and objects */
const TM_KEY = "Lpdy3vX87eDAFfSO7RcgKAaQZzL4rsRK";
const GOOGLE_KEY = "AIzaSyDHxneOmC7wPyuap2-wMrNaTi9_i3o4Abo";
const TM_SIZE = 25;
const TM_RADIUS = 53; // miles
var windowLatitude = "";
var windowLongitude = "";

//tmEvent
var tmEvent = function (id, name, url, genreName, startlocalDate, startlocalTime, distance, maxPrice, minPrice, currencyPrice, venuesAddress, venuesCity, venuesState, imageUrlSmall, imageUrlLarge) {
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
}

var userInput = function (keyword, startDate, endDate, location, latitude, longitude) {
    this.keyword = keyword;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.latitude = latitude;
    this.longitude = longitude;
    this.geoPoint = function () {
        if(this.latitude ==='' || this.latitude==null || this.longitude==='' || this.longitude==null){
            return '';
        }
        else{
        return this.latitude + "," + this.longitude;
        }
    };
}

// Main functions are here
var getUserCoords = function () {
    var latitude;
    var longitude;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            windowLatitude = latitude;
            windowLongitude = longitude;
        });
    }
    else {
        console.log("<h4>Your browser doesn't support.</h4>");
    }
}
function tmEventSearch(userInput) {
    var tmEventList = [];
    var rootUrl = "https://app.ticketmaster.com/discovery/v2/events.json?size=" + TM_SIZE + "&apikey=" + TM_KEY + "&radius=" + TM_RADIUS + "&unit=miles";
    var queryParameters = "";
    if (userInput.keyword !== '' && userInput.keyword != null) {
        queryParameters += "&keyword=" + userInput.keyword;
    }
    console.log(windowLatitude);
    console.log(userInput.geoPoint());
    if (userInput.geoPoint !== '' && userInput.geoPoint != null) {
        queryParameters += "&geoPoint=" + userInput.geoPoint();
    }

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
        queryParameters += "&city=" + userInput.location;
    }
    var queryUrl = rootUrl + queryParameters;
    console.log(queryUrl);
    $("#displayResults").empty();
    $.ajax({
        type: "GET",
        url: queryUrl,
        async: true,
        dataType: "JSON",
        success: function (response) {
            var countEvents = response.page.totalElements;
            var displayResults = $("#displayResults");
            if (countEvents === 0) {
                var test = $("<h1>");
                test.html("There is no events available!");
                displayResults.html(test);
                return false;
            }

            console.log("Number of events in your search is: " + countEvents);
            //  console.log(response._embedded)
            for (var i = 0; i < response._embedded.events.length; i++) {
                var id = response._embedded.events[i].id;
                var name = response._embedded.events[i].name;
                var url = response._embedded.events[i].url;
                if (response._embedded.events[i].hasOwnProperty("classifications")) {
                    if (response._embedded.events[i].classifications.length > 0) {
                        var genreName = response._embedded.events[i].classifications[0].genre.name;
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
                    var maxPrice = "";
                    var minPrice = "";
                    var currencyPrice = "";
                }
                if (response._embedded.events[i]._embedded.hasOwnProperty("venues")) {
                    if (response._embedded.events[i]._embedded.venues.length > 0) {
                        var venuesAddress = response._embedded.events[i]._embedded.venues[0].address.line1;
                        var venuesCity = response._embedded.events[i]._embedded.venues[0].city.name;
                        var venuesState = response._embedded.events[i]._embedded.venues[0].state.name;
                    }
                }
                else {
                    var venuesAddress = "tba";
                    var venuesCity = "tba";
                    var venuesState = "tba";
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
                            if (width > 500 && height > 500 && !lFlag) {
                                var imageUrlLarge = response._embedded.events[i].images[j].url;
                                lFlag = true;
                            }
                        }
                        if (!sFlag) { var imageUrlSmall = ""; }
                        if (!lFlag) { var imageUrlLarge = ""; }
                    }
                    else {
                        var imageUrlSmall = "";
                        var imageUrlLarge = "";
                    }
                }
               
                var tmEventSingle = new tmEvent(id, name, url, genreName, startlocalDate, startlocalTime, distance, maxPrice, minPrice, currencyPrice, venuesAddress, venuesCity, venuesState, imageUrlSmall, imageUrlLarge);
                var imageUrlSmallTag=$("<img>");
                imageUrlSmallTag.attr("src",imageUrlSmall)
                displayResults.append(imageUrlSmallTag);
                var idTag=$("<span>");
                idTag.html(id+"<br>");
                displayResults.append(idTag);
                var nameTag=$("<h5>");

                nameTag.html("<a href='#' >"+name+"</a>");
                displayResults.append(nameTag);

                tmEventList.push(tmEventSingle);
            }
        },  //end of success callback
        error: function () {
            console.log("Something is wrong in ajax call: error");
            return false;
        }
    });
    console.log(tmEventList);
    return tmEventList;
  
}

function displaySearchResult(tmEventList) {
    var displayResults = $("#displayResults");
    var test = $("<p>");
    test.html(keyword);
    displayResults.append(test);
}


$("#btnSubmit").on("click", function (event) {
    event.preventDefault();
    var keyword = $("#keyword").val().trim();
    var startDate = $("#startDate").val().trim();
    var endDate = $("#endDate").val().trim();
    var location = $("#location").val().trim();
    console.log(keyword);
    console.log(startDate);
    console.log(endDate);
    console.log(location);
    console.log(windowLatitude);
    console.log(windowLongitude);
    var myUserInput = new userInput(keyword, startDate, endDate, location, windowLatitude, windowLongitude);
    var mytmEventList= tmEventSearch(myUserInput);
   
});
$("#btnReset").on("click", function (event) {
    event.preventDefault();
    $("#displayResults").empty();
    $("#keyword").val("");
    $("#startDate").val("");
    $("#endDate").val("");
    $("#location").val("");
})
getUserCoords();

//Extensive code taken from the google places documentation examples

var map;
var infowindow;
var service;
var type = [];
var lat = 33.669444;
var lng = -117.823056;
var eventName = "PlaceHolder";
var places = [];
function initMap() {
    var local = { lat, lng };
    map = new google.maps.Map(document.getElementById('map'), {
        center: local,
        zoom: 12
    });
    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    var initialPosition = new google.maps.Marker({
        position: local,
        map: map,
        title: eventName
    });
    google.maps.event.addListener(initialPosition, 'click', function () {
        infowindow.setContent(eventName);
        infowindow.open(map, this);
    })
    service.nearbySearch({
        location: local,
        radius: 5000,
        type
    }, callback);
}
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            places.push({ placeId: results[i].place_id });
        }
    }
}
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: placeLoc,
    });
    // places.push(place);
    // var request = { reference: place.reference };
    // service.getDetails(request, function (details, status) {
    //     // google.maps.event.addListener(marker, 'click', function () {
    //     //     label(details);
    //     //     //infowindow.setContent(details.name + "<br />" + details.formatted_address + "<br />" + details.website + "<br />" + details.rating + "<br />" + details.formatted_phone_number);
    //     //     infowindow.open(map, this);
    //     // });
    //     // var result = $("<div>");
    //     // var label = $("<p>");
    //     // label.text(details.name + " " + details.formatted_address + " " + details.rating + " " + details.openingHours.periods);
    //     // result.append(label);
    //     // $("#display").append(result);
    // });
    google.maps.event.addListener(marker, 'click', function () {
        label(place);
        infowindow.open(map, this);
    });
}
function label(place) {
    console.log(place.formatted_address);
    if (place.price_level == undefined && place.rating == undefined) {
        infowindow.setContent("<strong>Name:</strong> " + place.name);
    }
    else if (place.price_level == undefined) {
        infowindow.setContent("<strong>Name:</strong> " + place.name + "<br><strong>Rating:</strong> " + place.rating.toString());

    }
    else if (place.rating == undefined) {
        infowindow.setContent("<strong>Name:</strong> " + place.name + "<br><strong>Price Range:</strong> " + place.price_level.toString());
    }

    else {
        infowindow.setContent("<strong>Name:</strong> " + place.name + "<br><strong>Rating:</strong> " + place.rating.toString() + "<br><strong>Price Range:</strong> " + place.price_level);
    }
}
$("#lodging").on('click', function () {
    type[0] = "lodging";
    initMap();
})
$("#restaurants").on('click', function () {
    type[0] = "restaurant";
    initMap();
})
$("#parking").on('click', function () {
    type[0] = "parking";
    initMap();
})

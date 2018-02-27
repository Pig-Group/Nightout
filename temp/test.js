
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;
var type=[];
var lat= 33.669444;
var lng= -117.823056;
function initMap() {
    var pyrmont = { lat, lng };
    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: pyrmont,
        radius: 5000,
        type
    }, callback);
}
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
    
}
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    google.maps.event.addListener(marker, 'click', function () {
        label(place);
        infowindow.open(map, this);
    });
}
function label(place)
{
    if(place.price_level==undefined&&place.rating==undefined)
    {
        infowindow.setContent("Name: "+place.name);
    }
    else if(place.price_level==undefined)
    {
        infowindow.setContent("Name: "+place.name+" Rating: "+place.rating.toString());
    }
    else if(place.rating==undefined)
    {
        infowindow.setContent("Name: "+place.name+" Price Range "+place.price_level.toString());
    }
    else
    {
        infowindow.setContent("Name: "+place.name+" Rating: "+place.rating.toString()+" Price Range "+place.price_level);
    }
}
$("#lodging").on('click',function(){
    type[0]="lodging";
    initMap();
})
$("#restaurants").on('click',function(){
    type[0]="restaurant";
    initMap();
})
$("#parking").on('click',function(){
    type[0]="parking";
    initMap();
})
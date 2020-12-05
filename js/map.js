// GOOGLE MAP
let map;
var markers = [];
var opened_info_window = false;
async function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: 34.0354899, lng: -118.2439235 },
	    zoom: 13,
	});
	var places = await getPlaces();
	places.forEach(function(place) {
		markers.push(createMarker(place));
	});
	google.maps.event.addListener(map, "dragend", function () {
		displaySearchButton();
		google.maps.event.clearListeners(map, "dragend");
	});
}

function createMarker(place) {
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(getLatitude(place), getLongitude(place)),
		map: map,
		title: getName(place)
	});
	var contentString = buildLocationInfo(place)
	var infowindow = new google.maps.InfoWindow({
		content: contentString,
	});
	marker.addListener("click", () => {
		if(opened_info_window) {
			opened_info_window.close();
		}
		opened_info_window = infowindow;
		infowindow.open(map, marker);
	});
	return marker
}

function displaySearchButton() {
	var search_button = document.createElement('div');
	var search_button_ui = document.createElement('div');
	search_button_ui.setAttribute("id", "search-button-ui");
	search_button_ui.title = "Click to search this area";
	var search_button_text = document.createElement('div');
	search_button_text.setAttribute("id", "search-button-text");
	search_button_text.innerHTML = "Search This Area";
	search_button_ui.appendChild(search_button_text)
	search_button.appendChild(search_button_ui)
	search_button_ui.addEventListener("click", () => {
		var center = map.getCenter();
		var latitude = center.lat();
		var longitude = center.lng();
		searchThisArea(latitude, longitude)
	});
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(search_button);
}

async function searchThisArea(lat, long) {
	// clear existing markers
	markers.forEach((marker) => {
		marker.setMap(null)
	});
	markers = [];

	// fetch new FoodOasis data
	var places = await getPlaces(lat, long);
	// re-populate map
	places.forEach(function(place) {
		markers.push(createMarker(place));
	});
}


// FOOD OASIS
async function getPlaces(lat, long) {
	try {
		return await fetchFoodOasis(lat, long);
	} catch(err) {
		console.log(`Error fetching from FoodOasis: $(err)`);
	}
}

// FoodOasis API
// GET FoodOasis Response Data
async function fetchFoodOasis(latitude=34.035, longitude=-118.244) {
  let response = await fetch(`https://foodoasis.la/api/stakeholderbests?categoryIds[]=1&categoryIds[]=9&latitude=${latitude}&longitude=${longitude}&distance=5&isInactive=false&verificationStatusId=0&tenantId=1`);
  return await response.json();
}

// Helper Functions
function buildLocationInfo(place) {
	var name_line = getWebsite(place) ? `<p><b><a href=${getWebsite(place)}>${getName(place)}</a></b></p>` : `<p><b>${getName(place)}</b></p>`
	var mailing_address = buildMailingAddress(place);
	var info = '<div id="locationBodyContent">' +
		name_line +
		`<p>${getPhone(place)}</p>` +
		`<p>${mailing_address[0]}</p>` +
		`<p>${mailing_address[1]}</p>` +
		'</div>'
	return info
}

function buildMailingAddress(place) {
	let mailing_address = [];
	mailing_address.push(place.address2 ? `${place.address1} ${place.address2}` : `${place.address1}`)
	mailing_address.push(`${place.city}, ${place.state} ${place.zip}`)
	return mailing_address
}

function getName(place) {
	return place['name']
}

function getPhone(place) {
	return place['phone']
}

function getWebsite(place) {
	return place['website']
}

function getLatitude(place) {
	return place['latitude']
}

function getLongitude(place) {
	return place['longitude']
}
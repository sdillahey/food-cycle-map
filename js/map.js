// Public Methods
// on center_changed, display search this area button
// on click, searchThisArea
function searchThisArea(lat, long) {
	// on button click
	// get map coordinates
	// fetch new foodoasis data
	// repopulate map
}

// GOOGLE MAP
let map;
var opened_info_window = false;
async function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: 34.0354899, lng: -118.2439235 },
	    zoom: 11,
	});
	var places = await getPlaces();
	places.forEach(function(place) {
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
	});
}

function mapChange() {
	google.maps.event.addListener(map, "center_changed", function() {
	  var center = this.getCenter();
	  var latitude = center.lat();
	  var longitude = center.lng();
	});
}


// FOOD OASIS
// Public Methods
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
  let response = await fetch(`https://foodoasis.la/api/stakeholderbests?categoryIds[]=1&categoryIds[]=9&latitude=${latitude}&longitude=${longitude}&distance=6&isInactive=false&verificationStatusId=0&tenantId=1`);
  return await response.json();
}

// Helper Functions
function buildLocationInfo(place) {
	var mailing_address = buildMailingAddress(place);
	var info = '<div id="locationBodyContent">' +
		`<p><b><a href=${getWebsite(place)}>${getName(place)}</a></b></p>` +
		`<p>${getPhone(place)}</p>` +
		`<p>${mailing_address[0]}</p>` +
		`<p>${mailing_address[1]}</p>`
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
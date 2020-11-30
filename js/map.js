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
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.0354899, lng: -118.2439235 },
    zoom: 11,
  });
}

google.maps.event.addListener(map, "center_changed", function() {
  var center = this.getCenter();
  var latitude = center.lat();
  var longitude = center.lng();
});


// FOOD OASIS
// Public Methods
function getPlaces(lat=null, long=null) {
	return fetchFoodOasis(lat, long)
}

// FoodOasis API
// GET FoodOasis Response Data
async function fetchFoodOasis(latitude=34.035, longitude=-118.244) {
  let response = await fetch(`https://foodoasis.la/api/stakeholderbests?categoryIds[]=1&categoryIds[]=9&latitude=${latitude}&longitude=${longitude}&distance=4&isInactive=false&verificationStatusId=0&tenantId=1`);
  return await response.json();
}

// Helper Functions
function buildMailingAddress(place) {
	let mailing_address = [];
	mailing_address.push(place.address2 ? `${place.address1} ${place.address2}` : `${place.address1}`)
	mailing_address.push(`${place.city}, ${place.state} ${place.zip}`)
	return mailing_address
}
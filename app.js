const myMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers: [],
}

myMap.buildMap = function () {
    this.map = L.map('map', {
        center: { lat: this.coordinates[0], lng: this.coordinates[1] },
        zoom: 11,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    const marker = L.marker(this.coordinates)
        .addTo(this.map)
        .bindPopup('<p1><b>You are here</b><br></p1>')
        .openPopup();
};





myMap.addMarkers = function () {
    for (var i = 0; i < this.businesses.length; i++) {
        const marker = L.marker([
            this.businesses[i].lat,
            this.businesses[i].long,
        ])
            .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
            .addTo(this.map);

        this.markers.push(marker);
    }
};


    async function getCoords() {
        const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
        });
        return [pos.coords.latitude, pos.coords.longitude];
    }
    
    

async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
        }
    }
    let limit = 5
    let lat = myMap.coordinates[0]
    let lon = myMap.coordinates[1]
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let businesses = parsedData.results
    return businesses
}

function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}

window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}

document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const business = document.getElementById('menu').value;
    const data = await getFoursquare(business);
    myMap.businesses = processBusinesses(data);
    myMap.addMarkers();
})

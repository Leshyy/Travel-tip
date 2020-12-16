import { locationService } from './services/location-service.js';

console.log('locationService', locationService);

let gGoogleMap;

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    getUserPosition()
        .then((pos) => {
            console.log('User position is:', pos.coords);
        })
        .catch((err) => {
            console.log('err!!!', err);
        });

    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        panTo(35.6895, 139.6917);
    });

    locationService.getLocations()
        .then(locations => {
            renderLocations(locations)
            document.querySelectorAll('.go-btn').map(btn => {
                return btn.addEventListener('click', ev => {
                    onGoTo(ev.dateSet.lat, ev.dateSet.lng)
                })
            })

            document.querySelectorAll('.delete-btn').map(btn => {
                return btn.addEventListener('click', ev => {
                    onDelete(ev.dateSet.idx)
                })
            })
        })


};



export function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi().then(() => {
        gGoogleMap = new google.maps.Map(document.querySelector('#map'), {
            center: { lat, lng },
            zoom: 15,
        });
        gGoogleMap.addListener('click', ev => {
            // console.log('lat', ev.latLng.lat(), 'lng', ev.latLng.lng());
            locationService.addLocation(ev.latLng.lat(), ev.latLng.lng());

            locationService.getLocations()
                .then(locations => renderLocations(locations));
        })
    });
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!',
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}

function getUserPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve();
    const API_KEY = 'AIzaSyA9krZ02aDNloGSkQmiwb-2XLuChoMHJh4'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load');
    });
}


function renderLocations(locations) {
    const strHtmls = locations.map((location, idx) => {
        return `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${location.name}</td>
                    <td>${location.lat}</td>
                    <td>${location.lng}</td>
                    <td><button class="go-btn" data-lat="${location.lat}" data-lng="${location.lng}" >Go!</button></td>
                    <td><button class="delete-btn" data-idx="${idx}">Delete</button></td>
                </tr>
              `
        // <td>${location.weather}</td>
        // <td>${location.createdAt}<   /td>
        // <td>${location.updatedAt}</td>
    })
    document.querySelector('.locations-data').innerHTML = strHtmls.join('');
}

function onGoTo(lat, lng) {
    console.log('lat', lat);
    initMap(lat, lng);
}

function onDelete(idx) {
    locationService.deleteLocation(idx);

    locationService.getLocations()
        .then(locations => renderLocations(locations));
}






export const locationService = {
    getLocations,
    addLocation
}


const gLocations = [{ lat: 17, lng: 19, name: 'Puki Home', weather: '', createdAt: '', updatedAt: '' }];

function getLocations() {
    return Promise.resolve(gLocations)
}


function addLocation(lat, lng) {
    const placeName = prompt('Enter place name');
    gLocations.push(_createLocation(placeName, lat, lng));
    return gLocations;
}

function deleteLocation(idx) {
    gLocations.splice(idx, 1);
}

function _createLocation(name, lat, lng) {
    return {
        lat,
        lng,
        name,
        weather: '',
        createdAt: '',
        updatedAt: ''
    }
}
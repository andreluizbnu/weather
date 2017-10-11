angular.module("forecastService", ['ngResource'])
    .factory('forecastService', forecastService)
    .constant('CLIENT_ID', 'nqOZ6EuPqtV1Wt7btnRTm')
    .constant('CLIENT_KEY', 'N8Qz3Z7DitLYyJopSUZ2eAAijvQBEEwZOaamAk7t');

forecastService.$inject = ['$resource', 'CLIENT_ID', 'CLIENT_KEY'];

function forecastService($resource, CLIENT_ID, CLIENT_KEY) {
    return $resource('http://api.aerisapi.com/forecasts/:lat,:lng?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_KEY, {
        lat: '@lat',
        lng: '@lng'
    }, {
        query: {method: 'GET', isArray: false}
    });
}


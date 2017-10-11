'use strict';

angular.module('weatherApp').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
    });
}]).controller('homeCtrl', ['$scope', 'forecastService', 'moment', homeController]);


function homeController($scope, forecastService, moment) {
    var vm = this;
    vm.app = "Weather App";
    vm.options = {
        types: '(cities)'
    };

    vm.dayForecast = [];
    vm.weekForecast = [];


    vm.loadForecast = loadForecast;
    vm.showTemperatures = true;
    vm.showChart = true;
    vm.showRecommendations = true;


    vm.chartOptions = {
        title: {
            text: 'Temperatura da semana'
        },
        chart: {
            height: '200px'

        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    };

    function loadForecast(autocomplete) {
        var lat = vm.details.geometry.location.lat();
        var lng = vm.details.geometry.location.lng();


        var place = forecastService.query({lat: lat, lng: lng});
        place.$promise.then(function (data) {
            vm.location = autocomplete;
            vm.dayForecast.minTemp = data.response[0].periods[0].minTempC;
            vm.dayForecast.maxTemp = data.response[0].periods[0].maxTempC;
            findMinMaxWeek(data.response[0].periods)
        });
        vm.showTemperatures = true;
    }

    function findMinMaxWeek(periods) {
        var min = 99;
        var max = 0;
        var minDate = "";
        var maxDate = "";
        for (var i = 0; i < periods.length; i++) {
            var day = periods[i];
            if (day.minTempC < min) {
                min = day.minTempC;
                minDate = day.validTime;
            }
            if (day.maxTempC > max) {
                max = day.maxTempC;
                maxDate = day.validTime;
            }
        }
        vm.weekForecast.max = max;
        vm.weekForecast.maxDate = maxDate;
        vm.weekForecast.min = min;
        vm.weekForecast.minDate = minDate;
        console.log('MINDATE: ' + vm.weekForecast.minDate);
        console.log('MAXDATE: ' + vm.weekForecast.maxDate);
    }


}
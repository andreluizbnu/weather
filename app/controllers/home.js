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
    vm.showTemperatures = false;
    vm.showChart = false;
    vm.showFavoritesList = false;


    vm.chartOptions = {
        title: {
            text: 'Temperatura da semana'
        },
        chart: {
            height: '200px'

        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', '6', '7']
        },

        series: [{
            name: 'Min. Temp.',
            data: []
        }, {
            name: 'Max. Temp.',
            data: []
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
            findMinMaxWeek(data.response[0].periods);
            prepareChart(data.response[0].periods);
        });
        vm.showTemperatures = true;
        vm.showChart = true;
    }

    function prepareChart(periods) {

        vm.chartOptions = {
            title: {
                text: 'Temperatura da semana'
            },
            chart: {
                height: '200px'

            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', '6', '7']
            },

            series: [{
                name: 'Min. Temp.',
                data: []
            }, {
                name: 'Max. Temp.',
                data: []
            }]
        };

        for (var i = 0; i < periods.length; i++) {
            console.log('SERIES: ' + vm.chartOptions.series[0].data);
            vm.chartOptions.series[0].data.push(periods[i].minTempC);
        }

        console.log(vm.chartOptions.series[0].data);
        console.log(vm.chartOptions.series[1].data);

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
    }


}
'use strict';

angular.module('weatherApp').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
    });
}]).controller('homeCtrl', ['$scope', 'forecastService', 'moment', '$timeout', homeController]);


function homeController($scope, forecastService, moment, $timeout) {
    var vm = this;

    //configuration
    vm.app = "Weather App";
    vm.options = {
        types: '(cities)'
    };
    vm.selectedRow = null;
    vm.favoritesList = [];
    vm.dayForecast = [];
    vm.weekForecast = [];
    vm.recommendation = [];
    vm.warmRecommendation = [{desc: 'Go to the beach', class: 'fa fa-sun-o'},
        {desc: 'Ride a bicycle', class: 'fa fa-bicycle'},
        {desc: 'Play in the pool', class: 'fa fa-life-ring'}];
    vm.rainRecommendation = [{desc: 'Watch a movie', class: 'fa fa-film'},
        {desc: 'Drink a coffee', class: 'fa fa-coffee'},
        {desc: 'Practice indoor activities', class: 'fa fa-gamepad'}];
    vm.coldRecommendation = [{desc: 'Go sleep', class: 'fa fa-bed'},
        {desc: 'Drink a glass of wine', class: 'fa fa-glass'},
        {desc: 'Read a book', class: 'fa fa-book'}];
    vm.showTemperatures = false;
    vm.chart = [];
    vm.showChart = false;
    vm.showFavoritesList = false;
    vm.showRecommendation = false;
    vm.showLatestRecommendation = false;
    vm.chartOptions = {
        chart: {
            height: 300,
            width: 500,
            type: 'line',
            marginLeft: 60
        },
        title: {
            text: '',
            marginTop: '0'
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        xAxis: {
            categories: []
        },
        series: [{
            name: 'Min. Temp.',
            data: [],
            color: '#1E90FF'
        }, {
            name: 'Max. Temp.',
            data: [],
            color: '#B22222'
        }]

    };

    //methods
    vm.loadForecast = loadForecast;
    vm.setFavorite = setFavorite;
    vm.removeFavorite = removeFavorite;
    vm.selectFavorite = selectFavorite;

    function loadForecast() {
        vm.chart = Highcharts.charts[0];
        var lat = vm.details.geometry.location.lat();
        var lng = vm.details.geometry.location.lng();
        vm.formattedAddress = vm.details.formatted_address;


        var dayForecast = forecastService.getObservation.query({lat: lat, lng: lng});
        dayForecast.$promise.then(function (data) {
            vm.location = vm.formattedAddress;
            vm.dayForecast.tempC = data.response.ob.tempC;
            vm.dayForecast.weather = data.response.ob.weather;
            vm.dayForecast.img = 'imgs/' + data.response.ob.icon;
            prepareRecommendation(data.response.ob);
            vm.showTemperatures = true;
        });

        var weekForecast = forecastService.getForecast.query({lat: lat, lng: lng});
        weekForecast.$promise.then(function (data) {
            vm.dayForecast.minTemp = data.response[0].periods[0].minTempC;
            vm.dayForecast.maxTemp = data.response[0].periods[0].maxTempC;
            findMinMaxWeek(data.response[0].periods);
            prepareChart(data.response[0].periods);
            vm.showRecommendation = true;
            vm.showChart = true;
        });

    }

    function selectFavorite(index) {
        console.log('INDICE ' + index);
        vm.showLatestRecommendation = true;
        vm.favoritesList.selected = index;
    }


    $(window).resize(function () {
        var height = $('.highcharts-container').height();
        var width = $('.highcharts-container').height();
        $timeout(function () {
            Highcharts.charts[0].setSize(height, width);
        }, 2000);

    });

    function setFavorite() {
        var favorite = {
            name: vm.formattedAddress,
            dateAdded: moment().format('DD/MM'),
            minTemp: vm.dayForecast.minTemp,
            maxTemp: vm.dayForecast.maxTemp,
            recommendation: vm.recommendation
        };
        vm.favoritesList.push(favorite);
        vm.showFavoritesList = true;
    }

    function removeFavorite(index) {
        vm.favoritesList.splice(index, 1);
        if (vm.favoritesList.length === 0) {
            vm.showLatestRecommendation = false;
        }
    }

    function prepareChart(periods) {
        for (var i = 0; i < periods.length; i++) {
            vm.chartOptions.series[0].data[i] = periods[i].minTempC;
            vm.chartOptions.series[1].data[i] = periods[i].maxTempC;
            vm.chartOptions.xAxis.categories[i] = moment(periods[i].validTime).format('DD/MM');
        }
    }

    function prepareRecommendation(observation) {
        var cleanWeather = observation.weather.toLowerCase();
        var temp = observation.maxTempC;
        if (cleanWeather.includes('showers') || cleanWeather.includes('rain') || cleanWeather.includes('mostly cloudy') || cleanWeather.includes('drizzle') || cleanWeather.includes('storm')) {
            vm.recommendation = vm.rainRecommendation;
        } else if (cleanWeather.includes('sunny') || cleanWeather.includes('clear') || cleanWeather.includes('partly cloudy')) {
            vm.recommendation = vm.warmRecommendation;
        } else if (temp < 20) {
            vm.recommendation = vm.coldRecommendation;
        }
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
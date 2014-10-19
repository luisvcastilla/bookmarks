var cionApp = angular.module('cionApp', ['ngRoute','ngAnimate','picardy.fontawesome']);			
cionApp.config(function($routeProvider, $locationProvider) {
	// $locationProvider.html5Mode(true).hashPrefix('!');
	$routeProvider		
		.when('/', {
			templateUrl : 'pages/inicio.html',
			controller  : 'mainController'
		})					
		.when('/user', {
			templateUrl : 'pages/user.html',
			controller  : 'userController'
		})									
		.otherwise({ redirectTo: "/" });			
});
cionApp.run(function($rootScope, $location) {	   		
	console.log('running');
});
cionApp.controller('mainController', function($scope, $routeParams) {									
	$scope.pageClass = 'page-all';

        $(".element").typed({
        strings: ["cool", "easy", "collaborative", "quick", "awesome","texan","useful"],
        typeSpeed: 30, // typing speed
        loop: true, // loop on or off (true or false)

        // callback: function(){ }
        });
});	
cionApp.controller('userController', function($scope, $routeParams) {									
	$scope.pageClass = 'page-all';	
	console.log($routeParams);
});	
//SERVICIO DE BOOKMARKS
cionApp.factory( 'bmAPI', function($http) {
	var productos = [];
	var bmAPI = {
		slider: function() {
			var dog = 'yes';
		    return dog;
		},							   
	};
	return bmAPI;		
});
var cionApp = angular.module('cionApp', ['ngRoute']);			
cionApp.config(function($routeProvider,$locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');
	$routeProvider
		// route for the home page
		.when('/', {
			templateUrl : 'pages/inicio.html',
			controller  : 'mainController'
		})									
		.otherwise({ redirectTo: "/" });			
});
cionApp.run(function($rootScope, $location) {	   		
	console.log('running');
});
cionApp.controller('mainController', function($scope, $routeParams) {									
	$scope.pageClass = 'page-all';
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
var bookmarksApp = angular.module('bookmarksApp', ['ngRoute']);			
bookmarksApp.config(function($routeProvider,$locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');
	$routeProvider
		// route for the home page
		.when('/', {
			templateUrl : 'pages/inicio.html',
			controller  : 'mainController'
		})									
		.otherwise({ redirectTo: "/" });			
});
bookmarksApp.run(function($rootScope, $location) {	   		
	console.log('running');
});
bookmarksApp.controller('mainController', function($scope, $routeParams) {									
	$scope.pageClass = 'page-all';
});	
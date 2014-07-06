var voicesApp = angular.module('voicesApp', [
	'ngRoute'
]);

voicesApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/home', {
				templateUrl: 'partials/home.jade',
				controller: 'HomeCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
	}
]);
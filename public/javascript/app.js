var voicesApp = angular.module('voicesApp', [
	'ngRoute'
]);

voicesApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/home', {
				templateUrl: 'partial/home.html'
			}).
			otherwise({
				redirectTo: '/'
			});
	}
]);
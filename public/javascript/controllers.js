var voicesControllers = angular.module('voicesControllers', []);

voicesControllers.controller('HomeCtrl', ['$scope', '$http',
	function($scope, $http) {
		// Get post info
		$http.get('/api/post/get/recent').success(function(data) {
			$scope.recent = data;
		});
		$http.get('/api/post/get/all').success(function(data) {
			$scope.posts = data;
		})
	}
]);
var voicesServices = angular.module('Voices', ['ngResource']);

voicesServices.factory('Post', ['$resource',
	function($resource){
		return $resource('/partials/', {}, {
			get: {method: 'GET', params:{}, isArray: true};
		});
	}
]);
'use strict';

angular.module('myApp.view1', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'View1Ctrl'
    });
}])

.controller('View1Ctrl', function($scope, $rootScope, $auth) {
    console.log('View1Ctrl');
	$scope.signIn = $auth.login;
	if ($auth.user) {
	    $location.path("/view2");
	}
    $scope.test = function() {
        console.log("test");
    };
});
'use strict';

angular.module('myApp.view1', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'View1Ctrl'
    });
}])

.controller('View1Ctrl', function($scope, $rootScope, $location) {
    console.log('View1Ctrl');
	$scope.signIn = function() {
	    console.log("Sign in");
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
	};
    $scope.test = function() {
        console.log("test");
    };
});
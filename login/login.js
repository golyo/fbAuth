'use strict';

angular.module('myApp.view1', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'View1Ctrl',
    resolve: $authProvider.resolve
  });
}])

.controller('View1Ctrl', function($scope, $rootScope, $location, user) {
    console.log('View1Ctrl');
    console.log(user);
    if (user) {
        $location.path( "/view2" );
    }
    $scope.test = function() {
        console.log("test");
    };
});
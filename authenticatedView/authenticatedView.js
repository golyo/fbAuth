'use strict';

angular.module('myApp.authenticatedView', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
    $routeProvider.when('/authenticatedView', {
        templateUrl: 'authenticatedView/authenticatedView.html',
        controller: 'AuthenticatedViewCtrl',
        resolve: {
            user: function($auth){
                return $auth.userCheckPromise();
            }
        }
    });
}])

.controller('AuthenticatedViewCtrl', function($scope, $location, $auth, user) {
    console.log('AuthenticatedViewCtrl');
    console.log(user);
});
'use strict';

angular.module('myApp.view2', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view2', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl',
        resolve: {
            user: function(authService){
                return authService.getUser();
            }
        }
    });
}])

.controller('View2Ctrl', function($scope, $location, authService, user) {
    console.log('View2Ctrl');
    console.log(user);
});
'use strict';

angular.module('myApp.view1', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'View1Ctrl',
        resolve: {
            user: function(authService){
                return authService.getUser(true);
            }
        }
    });
}])

.controller('View1Ctrl', function($scope, $rootScope, $location, authService, user) {
    console.log('View1Ctrl');
    console.log(user);
    if (user) {
        $location.path("/view2");
    }
    $scope.login = authService.login;
    $rootScope.$on('$fbAuthStateChanged', function (user) {
        console.log("View1Ctrl.$loginSuccess");
        $rootScope.$apply(function() {
            $location.path("/view2");
        });
    });

});
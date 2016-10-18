'use strict';

angular.module('myApp.login', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl',
        resolve: {
            user: function($auth){
                return $auth.userPromise();
            }
        }
    });
}])

.run(function($rootScope, $location, $auth) {
})

.controller('LoginCtrl', function($scope, $rootScope, $location, $auth, user) {
    console.log('LoginCtrl');
    if (user) {
        $location.path("/authenticatedView");
    }
});

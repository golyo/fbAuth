'use strict';

angular.module('myApp.view1', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'View1Ctrl',
        resolve: {
            user: function($auth){
                return $auth.userPromise();
            }
        }
    });
}])

.run(function($rootScope, $location, $auth) {
})

.controller('View1Ctrl', function($scope, $rootScope, $location, $auth, user) {
    console.log('View1Ctrl');
    if (user) {
        $location.path("/view2");
    }
});

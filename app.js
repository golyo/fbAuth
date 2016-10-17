'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'fbAuth',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3'
])

.run(function($rootScope, $location, $auth) {
    $rootScope.logout = function() {
        $auth.logout();
        $location.path("/login");
    };

})

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider, $rootScope) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/login'});
    console.log('myApp.config');
}])

.factory('AuthFactory', function () {
     var user = null;
     return {
        setData: function(_user) {
           user = _user
        },
        getData: function() {
            console.log("getData");
           return user;
        }
     }
})

;


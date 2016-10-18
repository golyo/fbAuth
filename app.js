'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'fbAuth',
  'myApp.login',
  'myApp.authenticatedView',
  'myApp.noAuthView'
])

.run(function($rootScope, $location, $route, $auth) {
    $auth.initUnauthorizedCheck("/login");
    $rootScope.logout = function() {
        $auth.logout();
        $route.reload();
    };
    $rootScope.$on('$fbAuthStateChanged', function (event, user) {
        console.log("$fbAuthStateChanged " + (user != null));
        if (user && $location.path() == "/login") {
            $rootScope.$apply(function() {
                $location.path("/authenticatedView");
            });
        }
    });

})

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider, $rootScope) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/noAuthView'});
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


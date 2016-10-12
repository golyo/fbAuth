'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'fbAuth',
  'myApp.view1',
  'myApp.view2'
])

.run(function($rootScope, $location, AuthFactory) {
	$rootScope.signOut = function() {
    	console.log("logout");
    	firebase.auth().signOut();
    	$rootScope.user = null;
    	$location.path( "/login" );
	};
	/*
	var onAuthStateChanged = function(user) {
      console.log("onAuthStateChanged");
      // We ignore token refresh events.
      var toPath = "/login";
      if (user && $rootScope.user && $rootScope.user.uid === user.uid) {
        console.log("User already logged in");
        toPath = "/view2";
      } else if (user) {
        $rootScope.user = {
            uid : user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        };
        console.log("redirect to view2: " + $rootScope.user);
        toPath = "/view2";
        AuthFactory.setData(user);
      } else {
        console.log("go to login: ");
      }
//      $rootScope.$apply(function() {
//        $location.path(toPath);
//      });
      AuthFactory.setData($rootScope.user);
      console.log($location.path());
	};
    firebase.auth().onAuthStateChanged(onAuthStateChanged);
    */
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


'use strict';

angular.module('myApp.view2', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl',
    resolve: $authProvider.resolve
  });
}])

.controller('View2Ctrl', function($rootScope, $location, user) {
    console.log('View2Ctrl');
    console.log(user);
});
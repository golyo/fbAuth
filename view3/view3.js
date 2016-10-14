'use strict';

angular.module('myApp.view3', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  });
}])

.controller('View3Ctrl', function($rootScope, $location) {
    console.log('View3Ctrl');
});
'use strict';

angular.module('myApp.noAuthView', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/noAuthView', {
    templateUrl: 'noAuthView/noAuthView.html',
    controller: 'NoAuthViewCtrl'
  });
}])

.controller('NoAuthViewCtrl', function($rootScope, $location) {
    console.log('NoAuthViewCtrl');
});
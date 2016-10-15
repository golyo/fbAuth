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

.run(function($rootScope, $location, authService) {
    $rootScope.$on('$fbAuthStateChanged', function (event, changed) {
        if (changed && $location.path() == authService.getLoginPath()) {
            console.log("View1Ctrl.$loginSuccess apply")
            $rootScope.$apply(function() {
                $location.path("/view2");
            });
        }
    });
})

.controller('View1Ctrl', function($scope, $rootScope, $location, authService, user) {
    console.log('View1Ctrl');
    if (user) {
        $location.path("/view2");
    }
    $scope.login = authService.login;

});
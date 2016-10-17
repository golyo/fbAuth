'use strict';

angular.module('myApp.view1', ['ngRoute', 'fbAuth'])

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'View1Ctrl',
        resolve: {
            user: function($auth){
                return $auth.userPromise(true);
            }
        }
    });
}])

.run(function($rootScope, $location, $auth) {
    $rootScope.$on('$fbAuthStateChanged', function (event, changed) {
        if (changed && $location.path() == $auth.getLoginPath()) {
            console.log("View1Ctrl.$loginSuccess apply")
            $rootScope.$apply(function() {
                $location.path("/view2");
            });
        }
    });
})

.controller('View1Ctrl', function($scope, $rootScope, $location, $auth, user) {
    console.log('View1Ctrl');
    if (user) {
        $location.path("/view2");
    }
    $scope.login = $auth.login;

});

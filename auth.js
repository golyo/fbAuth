
angular.module('fbAuth', ['ngRoute'])

.provider('$auth', authProvider)

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider, $rootScope, $location) {
    console.log('firbase.auth.config');
}])

.run(function($rootScope, $location) {
})

;


function authProvider() {
    var fbAuth = firebase.auth();
    var loginPath = '/login';
    var userPromise = new Promise(function (resolve, reject) {
         if (fbAuth.user) {
              console.log("loggedInUser exists");
              resolve(fbAuth.user);
         } else {
              firebase.auth().onAuthStateChanged(function(user) {
                   console.log("onAuthStateChanged");
                   console.log(user);
                   resolve(user);
              });
         }
    });
    return {
         setLoginPath: function (value) {
              loginPath = value;
         },
         getLoginPath: function () {
              return loginPath;
         },
         signOut : function () {
             firebase.auth().signOut();
         },
         resolve: {
              user : function() {
                   return userPromise;
              }
         },
         $get: function () {
              return loggedInUser;
         }
    }
};
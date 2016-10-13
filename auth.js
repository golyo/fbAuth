
angular.module('fbAuth', ['ngRoute'])

.provider('$auth', authProvider)

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider, $rootScope, $location) {
    console.log('firbase.auth.config');
 }])

.run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        console.log("Rejection reason: " + rejection);
        $location.path('/login');
    });
})

;


function authProvider() {
    console.log("authProvider");
    var user;
    var fbAuth = firebase.auth();
    var loginPath = '/login';
    var initUser = function(fbUser) {
        user = {
            uid: fbUser.uid,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            displayName: fbUser.displayName
        };
    }
    var userPromise = new Promise(function (resolve, reject) {
         if (user) {
              console.log("loggedInUser exists");
              resolve(user);
         } else {
              fbAuth.onAuthStateChanged(function(fbUser) {
                   console.log("onAuthStateChanged " + (fbUser != null));
                   if (fbUser) {
                       initUser(fbUser);
                       resolve(user);
                   } else {
                       user = null;
                       reject("notLoggedIn");
                   }
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
              user : ['$q', function($q) {
                  return userPromise;
              }]
         },
         $get: function () {
              return user;
         }
    }
};
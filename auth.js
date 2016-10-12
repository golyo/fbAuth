
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
    var fbAuth = firebase.auth();
    var loginPath = '/login';
    var getUser = function(fbUser) {
        return {
            uid: fbUser.uid,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            displayName: fbUser.displayName
        };
    }
    var userPromise = new Promise(function (resolve, reject) {
         if (fbAuth.user) {
              console.log("loggedInUser exists");
              resolve(getUser(fbAuth.user));
         } else {
              fbAuth.onAuthStateChanged(function(user) {
                   console.log("onAuthStateChanged " + (user != null));
                   if (user) {
                       resolve(getUser(user));
                   } else {
                       //resolve(null);
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
              return fbAuth.user ? getUser(fbAuth.user) : null;
         }
    }
};
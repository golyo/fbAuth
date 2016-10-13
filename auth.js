
angular.module('fbAuth', ['ngRoute'])

.provider('$auth', authProvider)

.config(['$routeProvider', '$authProvider', function($routeProvider, $authProvider, $rootScope, $location) {
    console.log('firbase.auth.config');
 }])

.run(function($rootScope, $location, $auth) {
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        console.log("$routeChangeError, Rejection reason: " + rejection);
        if ("notLoggedIn" == rejection && current.originalPath != $auth.getLoginPath()) {
            $location.path($auth.getLoginPath());
        }
    });
})

;


function authProvider() {
    console.log("init authProvider");
    var appUser, deferred, isChecked;
    var loginPath = '/login';

    var fbAuth = firebase.auth();
    fbAuth.onAuthStateChanged(function(fbUser) {
        console.log("fbAuth.onAuthStateChanged: " + (fbUser != null));
        appUser = fbUser ? {
            uid: fbUser.uid,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            displayName: fbUser.displayName
        } : null;
        if (deferred) {
            if (fbUser) {
                deferred.resolve(appUser);
            } else {
                deferred.reject("notLoggedIn");
            }
            deferred = null;
        }
        isChecked = true;
    });

    this.setLoginPath =  function (value) {
        loginPath = value;
    };
    this.resolve = {
        user : ['$q', '$location', function($q, $location) {
            if (isChecked) {
                if (appUser) {
                    console.log("user already logged in");
                    return appUser;
                } else {
                    console.log("user not logged in");
                    throw "notLoggedIn";
                }
            } else {
                console.log("wait for auth result");
                deferred = $q.defer();
                return deferred.promise;
            }
        }]
    };
    this.$get = ["$location", function ($location) {
        return {
            login: function() {
                var aa = $location;
                var provider = new firebase.auth.GoogleAuthProvider();
                fbAuth.signInWithPopup(provider);
            },
            logout: function() {
                appUser = null;
                fbAuth.signOut();
                $location.path(loginPath);
            },
            getLoginPath: function() {
                return loginPath;
            },
            user : appUser
        };
    }];
};
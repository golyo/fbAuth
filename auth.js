
angular.module('fbAuth', ['ngRoute'])

.run(function($rootScope, $location, authService) {
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        console.log("$routeChangeError, Rejection reason: " + rejection);
        if ("notLoggedIn" == rejection && current.originalPath != authService.getLoginPath()) {
            $location.path(authService.getLoginPath());
        }
    });
})

.factory("authService", function($rootScope, $q){
    console.log("fbAuth factory");

    var appUser, deferred, isChecked, skipUserCheck;
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
        console.log(appUser);
        if (deferred) {
            if (fbUser) {
                deferred.resolve(appUser);
            } else if (skipUserCheck) {
                deferred.resolve(null);
            } else {
                deferred.reject("notLoggedIn");
            }
            deferred = null;
        }
        isChecked = true;
        $rootScope.$emit('$fbAuthStateChanged', appUser);
    }, function(err) {
        console.log("auth error");
        console.log(err);
    });

    return {
        getUser: function(skipCheck) {
            if (isChecked) {
                if (appUser) {
                    console.log("user already logged in ");
                    return appUser;
                } else {
                    console.log("user not logged in " + skipCheck);
                    if (skipCheck) {
                        return null;
                    } else {
                        throw "notLoggedIn";
                    }
                }
            } else {
                console.log("wait for auth result");
                skipUserCheck = skipCheck;
                deferred = $q.defer();
                return deferred.promise;
            }
        },
        getLoginPath : function() {
            return loginPath;
        },
        login: function() {
            var provider = new firebase.auth.GoogleAuthProvider();
            fbAuth.signInWithPopup(provider);
        },
        logout: function() {
            appUser = null;
            fbAuth.signOut();
            //$scope.$apply();
        }
    };
});

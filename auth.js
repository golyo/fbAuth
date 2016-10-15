
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

    var str = "firebase.auth.GoogleAuthProvider";
    console.log(window[str]);
    console.log(eval(str));

    console.log("authService init");

    var appUser, deferred, isChecked, skipUserCheck;
    var loginPath = '/login';
    var fbAuth = firebase.auth();

    fbAuth.onAuthStateChanged(function(fbUser) {
        console.log("authService.onAuthStateChanged: " + (fbUser != null));
        appUser = fbUser ? {
            uid: fbUser.uid,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            displayName: fbUser.displayName
        } : null;
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
        console.log("authService.onAuthStateChanged error");
        console.log(err);
        if (deferred) {
            deferred.reject("notLoggedIn");
        }
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
})

.directive("authButton", function() {
    return {
        restrict: 'A',   // 'A' is the default, so you could remove this line
        link: function (scope, element, attrs) {
            var providerFn = eval(attrs.providerClass);
            var scopes = scope.$eval(attrs.scopes);
            var customParams = scope.$eval(attrs.customParams);
            var provider = new providerFn();
            if (scopes) {
                console.log("authButton.scopes:");
                console.log(scopes);
                provider.addScope(scopes);
            }
            if (customParams) {
                console.log("authButton.customParams:");
                console.log(customParams);
                provider.setCustomParameters({
                  'login_hint': 'user@example.com'
                });
            }
            element.on('click', function() {
                firebase.auth().signInWithPopup(provider);
            });
        }
    };
})

var FirebaseProviderFactory = function() {
};

var AuthProviderFactory = function() {
    var providerMap = {};
    this.registerType = function(type, providerFunction) {

    };
}
;


angular.module('fbAuth', ['ngRoute'])

.run(function($rootScope, $location, $auth) {
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        console.log("$routeChangeError, Rejection reason: " + rejection);
        if (rejection && rejection.code == 401) {
            $location.path($auth.getLoginPath());
        }
    });
})

.provider('$auth', authProvider)

.directive("authButton", function() {
.directive("authButton", function($parse) {
    return {
        restrict: 'A',   // 'A' is the default, so you could remove this line
        link: function (scope, element, attrs) {
            var providerFn = eval(attrs.providerClass);
            var scopes = scope.$eval(attrs.scopes);
            var customParams = scope.$eval(attrs.customParams);
            var providerFn = eval(attrs.providerClass || "firebase.auth.GoogleAuthProvider");
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
            if (attrs.scopes) {
                angular.forEach(attrs.scopes.split(','), function(value) {
                    provider.addScope(value.trim());
                });
            }
            var customParams = scope.$eval(attrs.customParams);
            if (customParams && provider.setCustomParameters) {
                provider.setCustomParameters(customParams);
            }
            element.on('click', function() {
                firebase.auth().signInWithPopup(provider);
            });
        }
    };
});



function authProvider() {
    console.log("$authProvider init");
    var appUser, deferred, isChecked, skipUserCheck;
    var loginPath = '/login';
    var fbAuth = firebase.auth();

    var authError = {code:401, message: "Unauthorized"};
    var fbAuth = firebase.auth();

    var authPromise = function($q, skipCheck) {
        if (isChecked) {
            if (appUser) {
                console.log("user already logged in ");
                return appUser;
            } else {
                console.log("user not logged in " + skipCheck);
                if (skipCheck) {
                    return null;
                } else {
                    throw authError;
                }
            }
        } else {
            console.log("wait for auth result");
            skipUserCheck = skipCheck;
            deferred = $q.defer();
            return deferred.promise;
        }
    var promiseHandler = {
        authPromise: function($q, isCheck) {
            if (promiseHandler.isInitialized) {
                if (promiseHandler.fbUser) {
                    console.log("user already logged in ");
                    return promiseHandler.fbUser;
                } else {
                    console.log("user not logged in " + isCheck);
                    if (isCheck) {
                        throw authError;
                    } else {
                        return null;
                    }
                }
            } else {
                console.log("wait for auth result");
                promiseHandler.isCheck = isCheck;
                promiseHandler.deferred = $q.defer();
                return promiseHandler.deferred.promise;
            }
        },
        promiseCallback: function(fbUser) {
            console.log("$auth.onAuthStateChanged: " + (fbUser != null));
            promiseHandler.isInitialized = true;
            promiseHandler.fbUser = fbUser;
            if (promiseHandler.deferred) {
                if (fbUser) {
                    promiseHandler.deferred.resolve(fbUser);
                } else if (promiseHandler.isCheck) {
                    promiseHandler.deferred.reject(authError);
                } else {
                    promiseHandler.deferred.resolve(null);
                }
                promiseHandler.deferred = null;
            }
        }
    };
    this.$get = ["$rootScope", "$q", function($rootScope, $q){

    this.$get = ["$rootScope", "$q", "$location", function($rootScope, $q, $location){

        console.log("$auth.$get init");
        fbAuth.onAuthStateChanged(function(fbUser) {
            console.log("$auth.onAuthStateChanged: " + (fbUser != null));
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
                    deferred.reject(authError);
                }
                deferred = null;
            }
            isChecked = true;
            $rootScope.$emit('$fbAuthStateChanged', appUser);
        }, function(err) {
            console.log("$auth.onAuthStateChanged error");
            console.log(err);
            if (deferred) {
                deferred.reject("notLoggedIn");
            }
        });
        fbAuth.onAuthStateChanged(function(fbUser) {
            promiseHandler.promiseCallback(fbUser);
            $rootScope.$emit('$fbAuthStateChanged', fbUser);
        });
        return {
            userPromise: function() {
                return authPromise($q, true);
                return promiseHandler.authPromise($q, false);
            },
            userCheckPromise: function() {
                return authPromise($q, false);
                return promiseHandler.authPromise($q, true);
            },
            getLoginPath : function() {
                return loginPath;
            },
            login: function(provider) {
                fbAuth.signInWithPopup(provider);
            },
            logout: function() {
                appUser = null;
                promiseHandler.fbUser = null;
                fbAuth.signOut();
                //$scope.$apply();
            },
            initUnauthorizedCheck: function(loginPath) {
                $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
                    console.log("$routeChangeError, Rejection reason: " + rejection.code);
                    if (rejection && rejection.code == 401) {
                        $location.path(loginPath);
                    }
                });
            }
         };
    }];
}
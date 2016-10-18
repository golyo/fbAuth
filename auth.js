
angular.module('fbAuth', ['ngRoute'])

.run(function($rootScope, $location, $auth) {
})

.provider('$auth', authProvider)

.directive("authButton", function($parse, $auth) {
    return {
        restrict: 'A',   // 'A' is the default, so you could remove this line
        link: function (scope, element, attrs) {
            var providerFn = eval(attrs.providerClass || "firebase.auth.GoogleAuthProvider");
            var provider = new providerFn();
            if (attrs.scopes) {
                angular.forEach(attrs.scopes.split(','), function(value) {
                    provider.addScope(value.trim());
                });
            }
            var customParams = scope.$eval(attrs.customParams);
            if (customParams) {
                provider.setCustomParameters(customParams);
            }
            element.on('click', function() {
                if (attrs.type == "redirect") {
                    $auth.signInWithRedirect(provider);
                } else {
                    $auth.signInWithPopup(provider);
                }
            });
        }
    };
});



function authProvider() {
    console.log("$authProvider init");
    var fbAuth = firebase.auth();
    var authError = {code:401, message: "Unauthorized"};

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

    this.$get = ["$rootScope", "$q", "$location", function($rootScope, $q, $location){

        console.log("$auth.$get init");
        fbAuth.onAuthStateChanged(function(fbUser) {
            promiseHandler.promiseCallback(fbUser);
            $rootScope.$emit('$fbAuthStateChanged', fbUser);
        });
        return {
            userPromise: function() {
                return promiseHandler.authPromise($q, false);
            },
            userCheckPromise: function() {
                return promiseHandler.authPromise($q, true);
            },
            signInWithPopup: function(provider) {
                console.log("Login with popup")
                return fbAuth.signInWithPopup(provider);
            },
            signInWithRedirect: function(provider) {
                console.log("Login with redirect")
                return fbAuth.signInWithRedirect(provider);
            },
            logout: function() {
                promiseHandler.fbUser = null;
                fbAuth.signOut();
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
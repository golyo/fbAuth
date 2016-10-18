
angular.module('fbAuth', ['ngRoute'])

.run(function($rootScope, $location, $auth) {
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        console.log("$routeChangeError, Rejection reason: " + rejection.code);
        if (rejection && rejection.code == 401) {
            $location.path($auth.getLoginPath());
        }
    });
})

.provider('$auth', authProvider)

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
});



function authProvider() {
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
    var loginPath = '/login';

    this.$get = ["$rootScope", "$q", function($rootScope, $q){
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
            getLoginPath : function() {
                return loginPath;
            },
            login: function(provider) {
                fbAuth.signInWithPopup(provider);
            },
            logout: function() {
                promiseHandler.fbUser = null;
                fbAuth.signOut();
            }
         };
    }];
}
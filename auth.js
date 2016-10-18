
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
    console.log("$authProvider init");
    var loginPath = '/login';
    var authError = {code:401, message: "Unauthorized"};
    var fbAuth = firebase.auth();

    var authCallback = function(user) {
    };


    this.$get = ["$rootScope", "$q", function($rootScope, $q){

        _initAuthResolver = function() {
            return $q(function(resolve) {
                var off;
                var callback = function(user) {
                    console.log("in" + (user != null))
                    // Turn off this onAuthStateChanged() callback since we just needed to get the authentication data once.
                    off();
                    resolve(user);
                }
                off = fbAuth.onAuthStateChanged(callback);
            });
        };

        var _routerMethodOnAuthPromise = function(rejectIfAuthDataIsNull) {

                  // wait for the initial auth state to resolve; on page load we have to request auth state
                  // asynchronously so we don't want to resolve router methods or flash the wrong state
                  return _initAuthResolver().then(function() {
                    // auth state may change in the future so rather than depend on the initially resolved state
                    // we also check the auth data (synchronously) if a new promise is requested, ensuring we resolve
                    // to the current auth state and not a stale/initial state
                    var authData = fbAuth.currentUser, res = null;
                    if (rejectIfAuthDataIsNull && authData === null) {
                      res = $q.reject(authError);
                    } else {
                      res = $q.when(authData);
                    }
                    return res;
                  });
        };

        console.log("$auth.$get init");
        return {
            userPromise: function() {
                return _routerMethodOnAuthPromise(false);
            },
            userCheckPromise: function() {
                return _routerMethodOnAuthPromise(true);
            },
            getLoginPath : function() {
                return loginPath;
            },
            login: function(provider) {
                fbAuth.signInWithPopup(provider);
            },
            logout: function() {
                appUser = null;
                fbAuth.signOut();
                //$scope.$apply();
            }
         };
    }];
}
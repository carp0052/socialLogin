// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','satellizer'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

//add facebook auth with AppID
//link between my app and facebook  
.config(function ($authProvider) {
    $authProvider.facebook({
        clientId: '1728472337386104',
        scope: 'email, public_profile, user_photos, user_friends, user_birthday',
        responseType: 'token'
    });
})

//inject httpInterceptor
.config(function($httpProvider){
    $httpProvider.interceptors.push('httpInterceptor')
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.me',{
        url: '/me',
        views: {
            'menuContent':{
                templateUrl: 'templates/me.html',
                controller: 'MeCtrl',
                resolve:{
                    aboutMe: function($q, $rootScope, FacebookService){
                        var deferred = $q.defer();
                        FacebookService.me().success(function(data){
                            $rootScope.userId = data.id;
                            deferred.resolve(data);
                        }).error(function(errorData){
                            deferred.reject(errorData);
                        });
                        return deferred.promise;
                    }
                }
            }
        }
    })

    .state('app.myFriends', {
            url: '/myFriends',
            views: {
                'menuContent': {
                    templateUrl: 'templates/myFriends.html',
                    controller: 'MyFriendsCtlr',
                resolve:{
                    friends: function($q, $rootScope, FacebookService){
                        var deferred = $q.defer();
                        FacebookService.friends($rootScope.userId).success(function(data){
                            $rootScope.userId = data.id;
                            deferred.resolve(data);
                        }).error(function(errorData){
                            deferred.reject(errorData);
                        });
                        return deferred.promise;
                    }
                }
                }
            }
        })
    
        .state('app.playlists', {
            url: '/playlists',
            views: {
                'menuContent': {
                    templateUrl: 'templates/playlists.html',
                    controller: 'PlaylistsCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/playlists');

    //    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
    //      $authProvider.cordova = true;
    //    }

    //    $authProvider.facebook({
    //        clientId: '1728472337386104',
    //        url: '#/app/auth/facebook',
    //        redirectUri: 'http://localhost:8100'
    //    });

});
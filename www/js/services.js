angular.module('starter.services', [])

.factory('FacebookService', function ($auth, $http, $ionicPopup) {
    //Might use a resource here that returns a JSON array

    //Some fake testing data
    //where do I want to connect
    var facebookApiURL = 'https://graph.facebook.com/v2.5';

    return {
        me: function () {
            //if I'm allowed to do the request
            if ($auth.isAuthenticated()) {
                return $http.get(facebookApiURL + '/me', {
                    params: {
                        access_token: $auth.getToken(),
                        fields: 'id, name, link, gender, birthday, bio, location, website, picture, relationship_status',
                        format: 'json'
                    }
                });
            } else {
                //if I am not allowed to do the request
                $ionicPopup.alert({
                    title: 'Error',
                    content: 'User Not Authorized'
                });
            }
        }, //end of me function

        friends: function (userId) {
            if ($auth.isAuthenticated() && userId) {
                return $http.get(facebookApiURL + '/' + userId + '/friends', {
                    params: {
                        access_token: $auth.getToken()
                    }
                });
            } else {
                $ionicPopup.alert({
                    title: 'Error',
                    content: 'User Not Authorized'
                });
            }
        }
    }; //end of return
})//end FacebookService

.factory('httpInterceptor', function($q, $rootScope, $log){
    var numLoadings = 0;
        return {
            request: function(config){
                numLoadings++;
                
                //Show Loader
                $rootScope.$broadcast("loader_show");
                return config || $q.when(config)
            }, //end request
            response: function(response){
                if((--numLoadings) === 0){
                    //Hide loader
                    $rootScope.$broadcast("loader_hide");
                }
                return response || $q.when(response);
            }, //end response
            responseError: function (response){
                if(!(--numLoadings)){
                    //hide loader
                    $rootScope.$broadcast("loader_hide");
                }
                $rootScope.$broadcast("authentication-failed");
                
                return $q.reject(response);
            }//end responseError
        }; //end return
}); //end httpInterceptor


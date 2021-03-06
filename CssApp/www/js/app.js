// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.constant('FIREBASE_URL','https://music-catalog.firebaseio.com/')
.config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){
            $urlRouterProvider.otherwise('/shop/home');
            
            $stateProvider
                .state('musicshop', {
                    url:'/shop',
                    abstract:true,
                    templateUrl: 'templates/side-menus.html'
               })//abstract view shop
               .state('musicshop.home', {
                    url:'/home',
                    views: {
                        'content':{
                            templateUrl:'templates/welcome.html'
                        }// view content
                    }//views
               })//view home
               .state('musicshop.categories', {
                    url:'/categories',
                    views:{
                        'content':{
                            templateUrl:'templates/categories.html',
                            controller:'ListCtrl'
                        }//view content
                    }//views
               })//view categories
               .state('musicshop.items', {
                    url:'/:catid/items',
                    views: {
                        'content':{
                            templateUrl:'templates/items.html',
                            controller:'ItemsCtrl'
                        }// view content
                    }//views items in category
               })
               .state('musicshop.item', {
                  url:'/category/:catid/item/:itemid',
                  resolve: {
                    'itemContent': ['UserService',function(UserService){
                        return UserService.requireLogin();
                    }]  
                  },
                  views:{
                      'content':{
                          templateUrl:'templates/item.html',
                          controller:'ItemsCtrl'
                      }//view item content
                  }//item views
               })
               .state('users',{
                   url:'/user',
                   abstract: true,
                   templateUrl: 'templates/tabs-abstract.html'
               })
               .state('users.login',{
                   url:'/login', // #/user/login
                   views:{
                       'user-login':{
                           templateUrl:'templates/login.html',
                            controller:'UserCtrl'
                       }//user login template
                   }//login views
               })
               .state('users.register',{
                    url:'/user-registration',
                    views:{
                        'registration':{
                            templateUrl:'templates/registration.html',
                            controller:'UserCtrl'
                        }//registration template
                    }//registration views
               });
}]) //states
.run(['$rootScope','$state',function($rootScope,$state){
      $rootScope.$on('$stateChangeError', 
        function(event, toState, toParams,fromState, fromParams,error){
          if( error === 'AUTH_REQUIRED')
          {
            $state.go('users.login');
          }
      }); //on state change error
}])
//============================================================================================
function empty(value){
    return value === '' || value === 0 || value === undefined || value ===null;
}

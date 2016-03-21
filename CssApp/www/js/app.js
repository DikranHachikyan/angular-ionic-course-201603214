// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

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
               });
}]) //states
.controller('ItemsCtrl',[
             '$scope','$http','$stateParams',
             function($scope,$http,$stateParams){
             console.log('category id:', $stateParams.catid);
                 $http.get('js/cd-db-users-comments.json')
                      .then(function(response){
                            //response.data.collections["alternative"]
                            //eval("response.data.collections." + $stateParams.catid)
                           $scope.items = response.data.collections[$stateParams.catid]  
                     })//on success
                     .catch(function(error){
                        console.log('Error:',error);
                 });// on error
}])//Items Ctrl
.controller('ListCtrl',[
    '$scope','$http',
    function($scope,$http){
        $scope.loadItems = function(){
          $http.get('js/cd-db-users-comments.json')
             .then(function(response){
                $scope.categories = []; 
                angular.forEach(response.data.categories, function(value,key){
                    value.id = key;
                    $scope.categories.push(value);
                });//for each category in categories
              
                //генерираме събитие за да спрем анимацията на зареждането
                $scope.$broadcast('scroll.refreshComplete');
             })//on success
             .catch( function(error){
                console.log('Error',error);
             });//on error  
        }// load Items form json file
        
         $scope.loadItems();//първоначално зареждане 

        $scope.reload = function(){
             $scope.loadItems();
         }; //reload items 
       $scope.moveItem = function(cat, $fromIdx, $toIdx){
           console.log('from:' + $fromIdx + ' ' + $toIdx);
           $scope.categories.splice($fromIdx, 1); //премахваме елемента на индекс fromIdx
           $scope.categories.splice($toIdx, 0, cat);
       };//move item 
       $scope.deleteItem = function(cat){
         $scope.categories.splice($scope.categories.indexOf(cat),1);        
       };//delete item 
        
}])//List Controller

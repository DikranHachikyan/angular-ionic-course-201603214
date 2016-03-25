app.controller('ItemsCtrl',[
             '$scope','$http','$state',
             function($scope,$http,$state){
             //console.log('state:', $state);
                  var catid = $state.params.catid;
                  var itemid = $state.params.itemid;
                 $scope.loadItems = function(cid){
                    $http.get('js/cd-db-users-comments.json')
                      .then(function(response){
                            //response.data.collections["alternative"]
                            //eval("response.data.collections." + $stateParams.catid)
                           $scope.page_title = response.data.categories[cid].title;
                           $scope.catid = cid;
                           $scope.items = response.data.collections[cid]  
                     })//on success
                     .catch(function(error){
                        console.log('Error:',error);
                 });// on error    
                 };//load items form category
                 
                 $scope.loadSingleItem = function( cid,id ){
                    $http.get('js/cd-db-users-comments.json')
                      .then(function(response){
                                //collections.alternative.MU555
                           $scope.item = response.data.collections[cid][id]; 
                           //console.log('item:', $scope.item);
                     })//on success
                     .catch(function(error){
                        console.log('Error:',error);
                 });// on error    
                 };//load single item data
                 
                if( catid && itemid )
                {
                    $scope.loadSingleItem(catid, itemid);
                }
                else
                {
                    $scope.loadItems(catid);
                }
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

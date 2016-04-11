app
.controller('CommentsCtrl', [
    '$scope','DataService', 
    function($scope,DataService){
        console.log('Comments from Users');
}])
.controller('UserCtrl',[
            '$scope','UserService',
            function($scope,UserService){
    $scope.logout = function(){
            console.log('user logout');
            UserService.logout();
    }; //logout  
    $scope.login = function( user){
        if( !empty(user.password1) && !empty(user.email))
        {    
            UserService.loginUser(user);
        }
       
    };//login            
    $scope.register = function(user){
        
        if( !empty(user.email) && !empty(user.password1) && user.password2 === user.password1 )
        {
            UserService.addUser(user);
         }
       
    };// register user
}])
.controller('ItemsCtrl',[
             '$scope','$state','DataService',
             function($scope,$state,DataService){
             //console.log('state:', $state);
                  var catid = $state.params.catid;
                  var itemid = $state.params.itemid;
                 $scope.loadItems = function(cid){
                        DataService.loadItems(cid);
                 };//load items form category
                 
                 $scope.loadSingleItem = function( cid,id ){
                        DataService.loadSingleItem(cid,id);
                 };//load single item data
                 $scope.catid = catid;
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
    '$scope','DataService',
    function($scope,DataService){
        $scope.loadItems = function(){
            DataService.loadCategories();
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

app.factory('DataService',[
    '$rootScope','$firebaseObject','FIREBASE_URL',
    function($rootScope,$firebaseObject,FIREBASE_URL){
        var ref = new Firebase(FIREBASE_URL);
        
        var retObj = {
            loadSingleItem: function(cat,id){
                var itmObj = $firebaseObject(ref.child('collections').child(cat).child(id));
                itmObj.$loaded()
                      .then(function(data){
                          
                          $rootScope.item = data;
                      })//on success
                      .catch(function(error){
                            console.log('Error', error);
                      });//on error
            },// load single item data
            loadItems: function(cat){
                var itemsObj = $firebaseObject(ref.child('collections').child(cat));
                var category = $firebaseObject(ref.child('categories').child(cat) );
                category.$loaded()
                        .then(function(data){
                            $rootScope.page_title = data.title;
                        })
                        .catch(function(error){
                             console.log('Error', error);
                       });//on error
                itemsObj.$loaded()
                        .then(function(data){
                            $rootScope.items = data;
                        })
                        .catch(function(error){
                            console.log('Error', error);
                       });//on error
            },//load items from category cat
            loadCategories: function(){
                var catObj = $firebaseObject(ref.child('categories'));
                catObj.$loaded()
                      .then(function(data){
                        $rootScope.categories = [];
                        angular.forEach(data, function(category,key){
                            category.id = key;
                            $rootScope.categories.push(category);
                        });
                        $rootScope.$broadcast('scroll.refreshComplete');
                      })//on success
                      .catch(function(error){
                           console.log('Error:' , error); 
                      });//on error
            }//Load Categories
        };
        
        return retObj;
}])//Firebase Data Service
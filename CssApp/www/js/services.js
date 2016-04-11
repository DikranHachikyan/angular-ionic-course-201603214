app
.factory('UserService',[
    '$rootScope','$firebaseObject','$firebaseAuth','$state','FIREBASE_URL',
    function($rootScope,$firebaseObject,$firebaseAuth,$state,FIREBASE_URL){
        var ref= new Firebase(FIREBASE_URL);
        var authObj = $firebaseAuth(ref);
        
        var retObj = {
            logout: function(){
                    delete $rootScope.currentUser;
                    authObj.$unauth();
            }, //logout
            requireLogin : function(){
                    return authObj.$requireAuth();
            }, //require user authentication
            loginUser : function (user){
                        
                        authObj.$authWithPassword({
                             'email': user.email,
                             'password':user.password1
                         })
                         .then(function(userData){
                             var usrObj = $firebaseObject(ref.child('users').child(userData.uid));
                             usrObj.$loaded()
                                   .then(function(data){
                                        console.log('User:', data)
                                        $rootScope.currentUser = data;
                                        $state.go('musicshop.categories');
                                  })//on success
                                    .catch(function(error){
                                         console.log('Error:', error);
                                  });//on error
                             
                             
                             
                         })
                         .catch( function(error){
                             console.log('Error:', error);
                         })//on error
            }//user login 
            , addUser : function (user){
                     //create a new user with email and password
                     authObj.$createUser({
                         'email': user.email,
                         'password':user.password1
                     }) //create new user
                     .then( function(userData){
                         var userObj = ref.child('users').child(userData.uid);
                         //add user data to the database
                         userObj.set({
                             'uid': userData.uid,
                             'email': user.email,
                             'firstname': user.firstname,
                             'lastname': user.lastname,
                             'created': Firebase.ServerValue.TIMESTAMP
                         });
                         //login the user
                         retObj.loginUser(user);
                     })//if success
                     .catch(function(error){
                         console.log('Error:', error);
                     })//on error
            }//add new user
        };
        
        return retObj;
}])
.factory('DataService',[
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
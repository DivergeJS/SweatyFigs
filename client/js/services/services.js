angular.module('fridgely.services', [])
  .factory('Search', function($http, $location) {
    var recipes = [];

    /**
     * @name sendIngredients
     * @desc Given a list of ingredients, send those ingredients to our server, and get a list
     *   of recipes as a response.
     * @param {???} ingredients - A list of ingredients to post to the server.
     * @returns {Promise.???} Return a promise containing a list of ingredientes.
     */
    var sendIngredients = function(ingredients) {
      return $http({
        method: 'GET',
        url: '/api/recipes',
        params: ingredients
      }).then(function(res) {
        recipes = res.data;
        $location.path('/recipes');
        console.log('The result back from the server is;', res);
      });
    };

    var getIngredientList = function(){
      return $http({
        method: 'GET',
        url: '/search/json',
      }).then(function(res){
        return res;
      });
    }

    /**
     * @name getRecipes
     * @desc Gives the stored recipes for whoever is asking for it
     * @returns list of recipes
     */
    var getRecipes = function() {
      return recipes;
    };

    return {
      sendIngredients: sendIngredients,
      getRecipes: getRecipes,
      recipes: recipes,
      getIngredientList: getIngredientList
    };
  })
  .factory('Favorites', function($window, $http, $location) {
    
    /**
      * @name addFavorites
      * @desc Given a list of favorite ingredients and send it to server
      * @return 
      */
    
    var addFavorite = function(favorite) {
      return $http({
        method: 'POST',
        url: '/user/favorites',
        data: {
          favorite: favorite
        }
      }).then(function(resp) {
        return resp;
        console.log('you added favorite item');
      })
    };
    
    /**
      * @name getFavorites
      * @desc get all favorites ingredients from the server 
      * @return  
      */
    
    var getFavorites = function() {
      return $http({
        method: 'GET',
        url: '/user/favorites'
      }).then(function(resp) {
        console.log('you requested to get all favorite ingredients: ', resp);
        return resp;
      })

    };


    /**
      * @name removeFavorites
      * @desc Iss
      */ 
    
    var removeFavorite = function(favorite) {
      return $http({
        method: 'POST',
        url: '/user/favorites',
        data: {
          favorite: favorite
        }
      }).then(function(resp) {
        return resp;
      })
    };

    return {
      addFavorite: addFavorite,
      getFavorites: getFavorites,
      removeFavorite: removeFavorite
    }       
  })
  .factory('Auth', function($http, $location, $window)  {
    /**
     * @name login
     * @desc Issues a post request to the server to attempt a login with user input info
     * @returns A browser token if sucessful login. If not, returns undefined
     */
    var login = function(user) {
      return $http({
        method: 'POST',
        url: '/api/users/login',
        data: user
      })
      .then(function (resp) {
        return resp.data.token;
      });
    };

    /**
     * @name signup
     * @desc Issues a post request to the server to attempt a signup with user input info
     * @returns A browser token if sucessful login. If not, returns undefined
     */
    var signup = function (user) {
      return $http ({
        method: 'POST',
        url: '/api/users/signup',
        data: user
      })
      .then( function (resp) {
        return resp.data.token;
      });
    };

    /**
     * @name isAuth
     * @desc Checks if there is a token attached to the browser
     * @returns Boolean
     */
      var isAuth = function() {
        console.log($window.localStorage.getItem('com.fridgely'));
        return !!$window.localStorage.getItem('com.fridgely');
      };

      /**
       * @name signout
       * @desc Removes the token attached to the browser
       * @returns undefined
       */
      var signout = function() {
        $window.localStorage.removeItem('com.fridgely');
        $location.path('/login');
      };

      return {
        login: login,
        signup: signup,
        isAuth: isAuth,
        signout: signout
      };

  })
  .factory('Shared',function(){
    // Factory service provides shared state between components.
    return {
      test: 'Hello World'
    };
  });
// factory fab
//three function 
//add fav
//remove fav
//get fav

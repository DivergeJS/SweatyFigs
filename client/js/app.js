// This file sets up the routes for fridgely

angular.module('fridgely', [
  'fridgely.auth',
  'fridgely.services',
  'fridgely.recipes',
  'fridgely.landing',
  'fridegly.search',
  'fridgely.favorites',
  'ngRoute',
  'angularFileUpload']
  )

  .config(function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'js/auth/login.html',
        controller: 'AuthController'
      })
      .when('/signup', {
        templateUrl: 'js/auth/signup.html',
        controller: 'AuthController'
      })
      .when('/landing', {
        templateUrl: 'js/landing/landing.html',
        controller: 'LandingPageController',
        authenticate: true
      })
      .when('/recipes', {
        templateUrl: 'js/recipes/recipes.html',
        controller: 'RecipeController',
        authenticate: true
      })
      .when('/search', {
        templateUrl: 'js/search/search.html',
        controller: 'SearchController',
        authenticate: true
      })
      .when('/signout', {
        templateUrl: 'js/auth/signout.html',
        controller: 'AuthController',
        authenticate: true
      })
      .when('/favorites', {
        templateUrl: 'js/favorites/favorites.html',
        controller: 'FavoritesController',
        authenticate: true
      })
      .when('/layout', {
        templateUrl: 'js/layout/layout.html',
        authenticate: true
      })
      .otherwise({
        redirectTo: '/layout'
      });

      //interceptor for every ajax request
      $httpProvider.interceptors.push('AttachTokens');
  })
  .factory('AttachTokens', function ($window) {
    /**
     * @name attach
     * @desc takes the token from the browser and sends it as a header for the request
     * @returns Request Object
     */
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.fridgely');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  
  .run(function ($rootScope, $location, Auth) {
    /**
     * @desc Makes sure user is authorized (with token) every route change
     */
    $rootScope.$on('$routeChangeStart', function( evt, next, current) {
      if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
        $location.path('/login');
      }
    });
  });

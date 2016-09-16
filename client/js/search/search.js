angular.module('fridegly.search', [])
  .controller('SearchController', function($scope, Search, Shared, Favorites) {
    $scope.data = {};
    $scope.data.selected = [];
    $scope.data.ingredientList = [];
    $scope.data.favorites = [];

    var getFavorites = () => {
      Favorites.getFavorites().then((res) => {
        $scope.data.favorites = res.data.local.favorites;
      });
    };
    /**
     * @name addIngredients
     * @desc Takes the user input ingredient and adds it to the array of current ingredients
     * @returns undefined
     */
    $scope.selectIngredient = function (ingredient) {
      // Scrub the input string so that it looks standardized. For exmaple, strings such as
      //   'chICKEN        FinGers' -> 'Chicken Fingers'. 
      var name = $scope.ingredient || ingredient;
      name = name.trim().split(/\s+/).map(function(item) {
        return item[0].toUpperCase() + item.substr(1).toLowerCase();
      }).join(' ');
      $scope.data.selected.indexOf(name) === -1 && $scope.data.selected.push(name);
      $scope.message = '';
      $scope.ingredient = '';
    };

    $scope.selectFavorite = (favorite) => {
      if ($scope.data.selected.indexOf(favorite) === -1) {
        $scope.data.selected.push(favorite);
      }
    };

    $scope.addFavorite = function(favorite) {
      var name = $scope.ingredient || favorite;
      name = name.trim().split(/\s+/).map(function(item) {
        return item[0].toUpperCase() + item.substr(1).toLowerCase();
      }).join(' ');

      if ($scope.data.favorites.indexOf(name) === -1) {
        Favorites.addFavorite(name).then((resp) => {
          getFavorites();
        });
      }
      $scope.ingredient = '';
    };

    $scope.removeFavorite = (favorite) => {
      Favorites.removeFavorite(favorite).then(() => {
        getFavorites();
      });
    };

    /**
     * @name deleteIngredient
     * @desc When a user clicks the 'x' on a current ingredient, this will remove the
     *       ingredient fron the list
     * @returns undefined
     */
    $scope.deleteIngredient = function(ingredient) {
      var ingredient = ingredient || this.ingredient;
      $scope.data.selected.splice($scope.data.selected.indexOf(ingredient), 1);
    };

    /**
     * @name sendIngredients
     * @desc When a user clicks on the Get Recipes button, this will call the Search service
     *       method, which sends the ingredients to the server
     * @returns undefined
     */
    $scope.sendIngredients = function () {
      if ($scope.data.selected.length === 0) {
        $scope.message = 'Please add one or more ingredients.';
      } else {
        var ingredients = {
          ingredients: $scope.data.selected
        };
        Search.sendIngredients(ingredients);
      }
    };

    getFavorites();

    Search.getIngredientList()
      .then(function(res){
        //$scope.data.ingredientList = res.data.slice(0, 10);
        $scope.data.ingredientList = res.data;
      });
  })
  .component('searchComponent', {
    templateUrl: 'js/search/search.html',
    controller: 'SearchController',
    bindings: {

    }
  });


//This may be used in the future to autocomplete ingredient words,  can be drawn from a database full of the ingredient list

// $('input.autocomplete').autocomplete({
//   data: {
//     "Apple": null,
//     "Microsoft": null,
//     "Google": 'http://placehold.it/250x250'
//   }
// });
//

angular.module('fridegly.search', [])
  .controller('SearchController', function($scope, Search, Shared) {
    $scope.data = {};
    $scope.shared = Shared;
    $scope.data.ingredients = [];
    $scope.shared.selected = [];
    $scope.shared.ingredients = [];

    $scope.shared.initIngredients = function() {
      if ($scope.shared.favorites) {
        $scope.shared.selected = _.union($scope.data.ingredients, $scope.shared.favorites);
      }
    };

    /**
     * @name addIngredients
     * @desc Takes the user input ingredient and adds it to the array of current ingredients
     * @returns undefined
     */
    $scope.addIngredient = function () {
      // Scrub the input string so that it looks standardized. For exmaple, strings such as
      //   'chICKEN        FinGers' -> 'Chicken Fingers'. 
      var name = $scope.ingredient.trim().split(/\s+/).map(function(item) {
        return item[0].toUpperCase() + item.substr(1).toLowerCase();
      }).join(' ');
      $scope.data.ingredients.indexOf(name) === -1 && $scope.data.ingredients.push(name);
      $scope.message = '';
      $scope.shared.selected = _.union($scope.data.ingredients, $scope.shared.favorites);
      $scope.ingredient = '';
      //$scope.shared.selected = $scope.shared.favorites.concat($scope.data.ingredients);
    };

    $scope.addFavorite = function() {
      var name = $scope.ingredient.trim().split(/\s+/).map(function(item) {
        $scope.shared.favorites.indexOf(name) === -1 && $scope.shared.favorites.push(name);
      });
      
    };

    /**
     * @name deleteIngredient
     * @desc When a user clicks the 'x' on a current ingredient, this will remove the
     *       ingredient fron the list
     * @returns undefined
     */
    $scope.deleteIngredient = function () {
      $scope.data.ingredients.splice($scope.data.ingredients.indexOf(this.ingredient), 1);
    };

    /**
     * @name sendIngredients
     * @desc When a user clicks on the Get Recipes button, this will call the Search service
     *       method, which sends the ingredients to the server
     * @returns undefined
     */
    $scope.sendIngredients = function () {
      if ($scope.shared.selected.length === 0) {
        $scope.message = 'Please add one or more ingredients.';
      } else {
        var ingredients = {
          ingredients: $scope.shared.selected
        };
        Search.sendIngredients(ingredients);
      }
    };

    Search.getIngredientList()
      .then(function(res){
        //$scope.shared.ingredients = res.data.slice(0, 10);
        $scope.shared.ingredients = res.data;
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

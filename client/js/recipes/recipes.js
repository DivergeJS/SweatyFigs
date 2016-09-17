/**
 * @name fridgely.recipes
 * @desc The angular controller for rendering recipes.
 */
angular.module('fridgely.recipes', ['ngSanitize'])
  .controller('RecipeController', function($scope, Search) {
    $scope.data = {};

    $scope.data.recipes = [];

    /**
     * @name getIngredients
     * @desc Get the ingredients for the current recipe from the Search service and store that
     *    in our data.
     * @returns {undefined}
     */
    $scope.getIngredients = function() {
      $scope.data.recipes = Search.getRecipes();
      console.log($scope.data.recipes); // DEBUG
    };

    $scope.getIngredients();

    //This toggles the display of the div that provides link to the search page
    $scope.showSearch = $scope.data.recipes.length === 0;

    $scope.snippet = '';

    /**
     * @name showSnippet
     * @desc Get the recipe the user clicked on to display that snippet
     * @returns {undefined}
     */
    $scope.showSnippet = function(recipe) {
      // recipe outputs:
      /*Object {id: 524312, title: "savory squash puree", image: "https://spoonacular.com/recipeImages/savory-squash-puree-524312.jpg", imageType: "jpg", usedIngredientCount: 1…}
      */
      $scope.snippet = recipe.title;
    };

    $scope.addRecipe = function(recipe) {
      
    };

    $scope.removeRecipe = function(recipe) {

    };

  })
  .component('recipesComponent', {
    templateUrl: 'js/recipes/recipes.html',
    controller: 'RecipeController',
  });

/**
 * @name fridgely.recipes
 * @desc The angular controller for rendering recipes.
 */
angular.module('fridgely.recipes', ['ngSanitize'])
  .controller('RecipeController', function($scope, Search) {
    $scope.data = {};

    $scope.data.recipes = [];

    $scope.data.myRecipes = [];

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

    $scope.getUserRecipes = function() {
      console.log('Getting recipes');
      Search.getUserRecipes().then(function(res) {
        var myRecipes = [];
        var recipes = res.data.local.recipes;
        recipes.forEach(function(recipe) {
          myRecipes.push(JSON.parse(recipe));
        });
        $scope.data.myRecipes = myRecipes;
        console.log($scope.data.myRecipes);
      });
    }

    $scope.addRecipe = function(recipe) {
      Search.addRecipe(recipe).then(function(resp) {
        $scope.getUserRecipes();
      });
    };

    $scope.removeRecipe = function(recipe) {
      recipe = JSON.stringify(recipe);
      Search.removeRecipe(recipe).then(function(resp) {
        $scope.getUserRecipes();
      })
    };

  })
  .component('recipesComponent', {
    templateUrl: 'js/recipes/recipes.html',
    controller: 'RecipeController',
  });

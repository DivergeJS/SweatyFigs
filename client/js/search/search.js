angular.module('fridegly.search', [])
  .controller('SearchController', function($scope, FileUploader, $http, Search, Shared, Favorites, fileUpload) {
    $scope.data = {};
    $scope.shared = Shared;
    $scope.data.ingredients = [];
    $scope.data.selected = [];
    $scope.data.ingredientList = [];
    $scope.data.favorites = [];
    $scope.option = 'Select Ingredient';
    $scope.filterOptions = ['Vegan', 'Vegetarian', 'Paleo'];
    $scope.filterOption = 'Select Diet';

    $scope.stepsModel = [];

    $scope.imageUpload = function(element){
        var reader = new FileReader();
        reader.onload = $scope.imageIsLoaded;
        reader.readAsDataURL(element.files[0]);
    }

    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
            $scope.stepsModel.push(e.target.result);
        });

      

    $scope.shared.initIngredients = function() {
      if ($scope.data.favorites) {
        $scope.data.selected = _.union($scope.data.ingredients, $scope.data.favorites);
      }
    };

    var getFavorites = () => {
      Favorites.getFavorites().then((res) => {
        $scope.favorites = res.data.local.favorites;
        console.log($scope.favorites);
        //$scope.data.favorites = $scope.data.favorites;
      });
    };

    getFavorites();

    $scope.format = function(phrase) {
      return phrase.trim().split(/\s+/).map(function(item) {
        return item[0].toUpperCase() + item.substr(1).toLowerCase();
      }).join(' ');
    }

    /**
     * @name addIngredients
     * @desc Takes the user input ingredient and adds it to the array of current ingredients
     * @returns undefined
     */
    $scope.addIngredient = function (ingred) {
      // Scrub the input string so that it looks standardized. For exmaple, strings such as
      //   'chICKEN        FinGers' -> 'Chicken Fingers'. 
      var name = !!ingred ? ingred : $scope.ingredient;
      name = name.trim().split(/\s+/).map(function(item) {
        return item[0].toUpperCase() + item.substr(1).toLowerCase();
      }).join(' ');
      $scope.data.ingredients.indexOf(name) === -1 && $scope.data.ingredients.push(name);
      $scope.message = '';
      $scope.data.selected = _.union($scope.data.ingredients, $scope.data.favorites);
      console.log($scope.data.selected);
      $scope.ingredient = '';
      //$scope.data.selected = $scope.data.favorites.concat($scope.data.ingredients);
    };

    $scope.selectFavorite = (favorite) => {
      console.log('Clicked');
        console.log(favorite);
      if ($scope.data.favorites.indexOf(favorite) === -1) {
        $scope.data.selected.push(favorite);
      }
    };

    $scope.selectIngredient = function(ingredient){
      $scope.addFavorite(ingredient);
    }

    $scope.addFavorite = function(favorite) {
      var name = !!favorite ? favorite : $scope.ingredient;
      name = name.trim().split(/\s+/).map(function(item) {
        return item[0].toUpperCase() + item.substr(1).toLowerCase();
      }).join(' ');
      if ($scope.data.favorites.indexOf(name) === -1) {
        console.log("name",name);
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
    $scope.deleteIngredient = function () {
      $scope.data.selected.splice($scope.data.ingredients.indexOf(this.ingredient), 1);
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
        if ($scope.filterOptions.indexOf($scope.filterOption) != -1) {
          var diet = $scope.filterOption;
        }
        var data = {
          ingredients: $scope.data.selected,
          diet: diet
        };
        Search.sendIngredients(data);
      }
    };

    Search.getIngredientList()
      .then(function(res){
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

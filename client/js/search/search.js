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

      var UPC_SET = {
          "3211": '0',
          "2221": '1',
          "2122": '2',
          "1411": '3',
          "1132": '4',
          "1231": '5',
          "1114": '6',
          "1312": '7',
          "1213": '8',
          "3112": '9'
      };
      
      var getBarcodeFromImage = function(imgOrId){
          var doc = document,
              img = doc.getElementById('imgOrId'),
              canvas = doc.createElement("canvas"),
              ctx = canvas.getContext("2d"),
              width = img.width,
              height = img.height,
              spoints = [1, 9, 2, 8, 3, 7, 4, 6, 5],
              numLines = spoints.length,
              slineStep = height / (numLines + 1);
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          while(numLines--){
              console.log(spoints[numLines]);
              var pxLine = ctx.getImageData(0, slineStep * spoints[numLines], width, 2).data,
                  sum = [],
                  min = 0,
                  max = 0;
              for(var row = 0; row < 2; row++){
                  for(var col = 0; col < width; col++){
                      var i = ((row * width) + col) * 4,
                          g = ((pxLine[i] * 3) + (pxLine[i + 1] * 4) + (pxLine[i + 2] * 2)) / 9,
                          s = sum[col];
                      pxLine[i] = pxLine[i + 1] = pxLine[i + 2] = g;
                      sum[col] = g + (undefined == s ? 0 : s);
                  }
              }
              for(var i = 0; i < width; i++){
                  var s = sum[i] = sum[i] / 2;
                  if(s < min){ min = s; }
                  if(s > max){ max = s; }
              }
              var pivot = min + ((max - min) / 2),
                  bmp = [];
              for(var col = 0; col < width; col++){
                  var matches = 0;
                  for(var row = 0; row < 2; row++){
                      if(pxLine[((row * width) + col) * 4] > pivot){ matches++; }
                  }
                  bmp.push(matches > 1);
              }
              var curr = bmp[0],
                  count = 1,
                  lines = [];
              for(var col = 0; col < width; col++){
                  if(bmp[col] == curr){ count++; }
                  else{
                      lines.push(count);
                      count = 1;
                      curr = bmp[col];
                  }
              }
              var code = '',
                  bar = ~~((lines[1] + lines[2] + lines[3]) / 3),
                  u = UPC_SET;
              for(var i = 1, l = lines.length; i < l; i++){
                  if(code.length < 6){ var group = lines.slice(i * 4, (i * 4) + 4); }
                  else{ var group = lines.slice((i * 4 ) + 5, (i * 4) + 9); }
                  var digits = [
                      Math.round(group[0] / bar),
                      Math.round(group[1] / bar),
                      Math.round(group[2] / bar),
                      Math.round(group[3] / bar)
                  ];
                  code += u[digits.join('')] || u[digits.reverse().join('')] || 'X';
                  if(12 == code.length){ return code; break; }
              }
              if(-1 == code.indexOf('X')){ return code || false; }
          }
          return false;
        };

        alert(getBarcodeFromImage());
        alert('FML');
    };

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

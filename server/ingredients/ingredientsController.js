var unirest = require('unirest');
var config = require('../env/config.js');
var request = require('request');
var rp = require('request-promise');
var _ = require('underbar');


/**
 * @name getPromise
 * @desc Given two strings, method representing an HTTP method, and uri representing the end of
 *    a spoonacular uri endpoint, return a promise that resolves to an object that is the
 *    response of an REST call to the spoonacular endpoint. 
 * @param {string} method - The HTTP method (GET, POST, etc.) that we would like to execute. 
 * @param {string} uri - The end of a URI that we would like to make a call against. 
 * @returns {Promise<Object>} Return a promise that resolves to a request response. 
 */
var getPromise = function(method, uri) {
  var options = {
    method: method,
    headers: {
      'X-Mashape-Key': config.api_key
    },
    url: `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${uri}`
  };

  return rp(options);  
};

/**
 * @name getSteps
 * @desc Given a string representing a recipe id, return an promise that resolves to an object
 *   containing the detailed steps to prepare the recipe. 
 * @param {string} id - A recipe ID that we're interested in.
 * @returns {Promise<Object>} Returns a promise that resolves to an object.
 */
var getSteps = function(id) {
  return getPromise('GET', `${id}/analyzedInstructions`);
};

/**
 * @name getSummary
 * @desc Given a string id representing a recipe id, return a promise that will resolve to an 
 *   object containing the recipe summary. 
 * @param {string} id - A string representing a recipe id. 
 * @returns {Promise<Object>} Returns a promise that will resolve to an object. 
 */
var getSummary = function(id) {
  return getPromise('GET', `${id}/summary`);
};

/**
 * @name getInfo
 * @desc Given a string id representing a recipe id, return a promise that will resolve to an 
 *   object containing the recipe information. 
 * @param {string} id - A string representing a recipe id. 
 * @returns {Promise<Object>} Returns a promise that will resolve to an object. 
 */
var getInfo = function(id) {
  return getPromise('GET', `${id}/information`);
};

/**
 * @name getRecipes
 * @desc Given either a single ingredient or a list of ingredients and optionally the number of 
 *   results we would like back, return a promise that resolves of a list of objects containing 
 *   recipe information.  
 * @param {string|string[]} ing - A string or a list of strings of ingredient names.
 * @param {number} [count=5] - The number of results to return.
 * @returns {Promise<object>} Returns a promise that will resolve to an object.
 */
var getRecipes = function(ingr, diet, count = 5) {
  var ingredientsStr = typeof ingr === 'string' ? [ingr] : ingr.join('%2c+');
  if (diet) {
    ingredientsStr = ingredientsStr + `&diet=${diet.toLowerCase()}`;
    console.log(ingredientsStr);
  }
  //findByIngredients
  //searchComplex?addRecipeInformation=true&
  return getPromise('GET', 'searchComplex?addRecipeInformation=true&fillIngredients=false&includeIngredients=' +
      `${ingredientsStr}&limitLicense=false&number=${count}&ranking=1`)
  .then(result => {
    return JSON.parse(result);
  });
};


module.exports = {
  
  getRecipesForIngredients: (req, res) => {
    if (req.query.ingredients) {
      getRecipes(req.query.ingredients, req.query.diet)
        .then(result => {
          var newRes = [];
          result.results.forEach(recipe => {
            newRes.push(recipe);
            // console.log('Recipe: ', recipe);
            newRes.push(getSummary(recipe.id));
            // console.log('Summary: ', getSummary(recipe.id));
            newRes.push(getSteps(recipe.id));
            // console.log('Steps: ', getSteps(recipe.id));
            newRes.push(getInfo(recipe.id));
            // console.log('Info: ', getInfo(recipe.id));
          });

          Promise.all(newRes).then(values => {
            var sol = [];
            for (var i = 0; i < values.length; i += 4) {
              var tmp = values[i];
              _.extend(
                tmp,
                JSON.parse(values[i + 1]),
                JSON.parse(values[i + 2]),
                JSON.parse(values[i + 3])
              );
              sol.push(tmp);
            }

            res.send(sol);
          });
        })
        .catch(function(err) {
          console.log(`There was an error: ${err}`);
          res.status(400).send('Problem fetching recipes.');
        });
    } else {
      res.status(400).send('No ingredients found');
    }
  }
};


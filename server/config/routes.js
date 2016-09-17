var ingredientsController = require('../ingredients/ingredientsController.js');
var helpers = require('./helpers.js');
var passport = require('passport');
var db = require('./utils.js');
var ingredientList = require('../ingredients/ingredientList.json');
// maybe recipes controller too

module.exports = function(app) {

  /**
    * @name /api/recipes
    * @desc routes to /api/recipes, and calls .getRecipesForIngredients handler
    * @param {req, res} the request and response for calls
    * @returns {nothing}
    */
  app.use('/api/recipes', helpers.decode);
  app.get('/api/recipes', ingredientsController.getRecipesForIngredients);

  app.route('/user/favorites')
    .get(function(req, res){
      db.getFavorites(req, res);
    })
    .post(function(req, res){
      console.log('POSTing')
      db.addFavorite(req, res);
    })  
    .put(function(req, res){
      console.log('inside the delete method of server');
      db.deleteFavorite(req, res);
    });

    app.get('/search/json', function(req, res){
      res.send(ingredientList);
    });

  app.route('/pictures/upc')
    .post(function(req, res){
      console.log(req.body);
      res.send(200);
    });

  // I'm not sure that we need these endpoints anymore.
  // app.get('/api/recipe/:recipeId', ingredientsController.getRecipeId);
  // app.post('/api/recipe/steps', ingredientsController.getRecipeSteps);
  // app.post('/api/recipe/summary', ingredientsController.getRecipeSummary);
  
  app.post('/api/users/login', passport.authenticate('local-login', {
    failureRedirect: '/#/login'
  }), function(req, res) {
    helpers.tokenize(req, res);
  });

  app.post('/api/users/signup', passport.authenticate('local-signup',
    {failureRedirect: '/#/signup'}),
    function(req, res) {
      helpers.tokenize(req, res);
    });
  
  // app.get('/api/users/signedin', userController.checkAuth);
};


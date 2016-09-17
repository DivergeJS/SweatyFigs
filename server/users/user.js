var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

  local : {
    username : String,
    password : String,
    favorites: [String],
    recipes: [String] 
  },

});

userSchema.methods.generateHash = function(password, callback) {
  bcrypt.hash(password, null, null, function(err, hash) {
    callback(hash);
  });
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

User = mongoose.model('User', userSchema);

module.exports = User;

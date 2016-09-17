angular.module('fridgely.auth', [])
  .controller('AuthController', function($scope, $window, $location, Auth) {
		// login-stuff
    $scope.user = {};

    /**
     * @name signUp
     * @desc Takes user inputted field, checks to see if the fields are valid and passwords match
     *  Gets a token back from the server and attaches it to the browser.
     */
    $scope.signUp = function() {
      $scope.user = {
        username: $scope.username,
        password: $scope.password
      };

      if ($scope.validate() && $scope.validatePW()) {
        Auth.signup($scope.user)
        .then(function (token) {
          if (token && token !== 'undefined') {
            $window.localStorage.setItem('com.fridgely', token);
            $location.path('/layout');
          } else {
            $scope.usernameMessage = 'Username is already taken';
          }
        })
        .catch(function (error) {
          console.error(error);
        });
      }
    };

    /**
     * @name signUp
     * @desc Takes user inputted field, checks to see if user and password matches in database
     *  Gets a token back from the server and attaches it to the browser.
     */
    $scope.login = function() {
      $scope.user = {
        username: $scope.username,
        password: $scope.password
      };
      if ($scope.validate()) {
        Auth.login($scope.user)
        .then(function(token) {
          if (token && token !== 'undefined') {
            $window.localStorage.setItem('com.fridgely', token);
            $location.path('/layout');
          } else {
            $scope.usernameMessage = 'Invalid username and password combination.';
          }
        })
        .catch(function (error) {
          console.error(error);
          $scope.text = 'Username or Password Invalid.';
        });
      }
    };

    $scope.validate = function() {
      // verify username
      var username = $scope.username;
      var usernameIsValid = username !== undefined && username !== '';
      if (!usernameIsValid) {
        $scope.usernameMessage = 'Please enter a valid username.';
      } else {
        $scope.usernameMessage = '';
      }

      // verify password
      var password = $scope.password;
      var passwordIsValid = password !== undefined && password !== '';
      if (!passwordIsValid) {
        $scope.passwordMessage = 'Please enter a valid password.';
      } else {
        $scope.passwordMessage = '';
      }



      return usernameIsValid && passwordIsValid;
    };

    $scope.validatePW = function () {
      // confirm password
      var password = $scope.password;
      var confirmpassword = $scope.confirmPassword;
      var confirmpasswordsMatch = confirmpassword === password;
      if (!confirmpasswordsMatch) {
        $scope.confirmpasswordMessage = 'Please retype the same password.';
      } else {
        $scope.confirmpasswordMessage = '';
      }

      return confirmpasswordsMatch;
    };

    $scope.signout = Auth.signout;
  });


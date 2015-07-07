angular.module('userService', [])

.factory('User', function($http) {
  var userFactory = {};
  // Create user
  userFactory.create = function(userData) {
    return $http.post('/api/signup', userData);
  }
  // List all users
  userFactory.all = function() {
    return $http.get('api/users');
  }
  return userFactory;
})

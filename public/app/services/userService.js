angular.module('userService', [])

.factory('User', function($http) {
  var userFactory = {};

  // List all users
  userFactory.all = function() {
    return $http.get('api/users');
  }
  
  return userFactory;
})

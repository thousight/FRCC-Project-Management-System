angular.module('userService', [])

.factory('User', function($http) {
  var userFactory = {};

  // List all users
  userFactory.allUsers = function() {
    return $http.get('api/all_users');
  }

  return userFactory;
})

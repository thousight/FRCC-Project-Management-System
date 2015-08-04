angular.module('userCtrl', ['userService'])

.controller('AllUsersController', function(User) {
  var vm = this;
  User.allUsers()
    .success(function(data) {
      vm.users = data;
    })
})

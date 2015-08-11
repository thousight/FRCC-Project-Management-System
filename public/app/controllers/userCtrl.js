angular.module('userCtrl', ['userService'])

.controller('AllUsersController', function(User, $scope) {
  var vm = this;

  User.allUsers()
  .success(function(data) {
    vm.users = data;
  })

  $scope.search = [];

  $(".users").select2({
    tags: true
  });
})

angular.module('userCtrl', ['userService'])

.controller('AllUsersController', function(User, $scope) {
  var vm = this;

  User.allUsers()
  .success(function(data) {
    vm.users = data;
  })

  $scope.search = [];

  $(".users").select2({
    tags: true,
    multiple: true,
    data: true,
    createTag: function(params) {
      return undefined;
    }
  });

  $(".createTask_Users").select2({
    tags: true,
    multiple: true,
    data: true,
    createTag: function(params) {
      return undefined;
    }
  });
})

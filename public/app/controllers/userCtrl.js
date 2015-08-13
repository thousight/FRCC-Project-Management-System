angular.module('userCtrl', ['userService', 'projectService'])

.controller('AllUsersController', function(User, Project, Task, $scope) {
  var vm = this;

  User.allUsers()
  .success(function(data) {
    vm.users = data;
    for (var c = 0; c < vm.users.length; c++) {
      vm.users[c].projectCount = 0;
      vm.users[c].taskCount = 0;
    }
    function contains(a, str) {
      for (var i = 0; i < a.length; i++) {
        if (a[i] === str) {
          return true;
        }
      }
      return false;
    }
    Project.allProjects()
    .success(function(data) {
      vm.projects = data;
      for (var j = 0; j < vm.users.length; j++) {
        for (var i = 0; i < vm.projects.length; i++) {
          if (vm.users[j]._id == vm.projects[i].creatorID || contains(vm.projects[i].assigneeID, vm.users[j]._id)) {
            vm.users[j].projectCount++;
          }
        }
      }
    })
    Task.allTasks()
    .success(function(data){
      vm.tasks = data;
      for (var a = 0; a < vm.users.length; a++) {
        for (var b = 0; b < vm.tasks.length; b++) {
          if (vm.users[a]._id == vm.tasks[b].creatorID || contains(vm.tasks[b].assigneeID, vm.users[a]._id)) {
            vm.users[a].taskCount++;
          }
        }
      }
    })
  })

  $scope.search = [];

})

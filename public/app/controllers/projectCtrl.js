angular.module('projectCtrl', ['projectService'])

.controller('ProjectController', function(Project, socketio) {
  var vm = this;
  Project.all()
    .success(function(data) {
      vm.projects = data;
    })

  vm.createProject = function() {
    vm.message = '';
    Project.create(vm.projectData)
      .success(function(data) {
        // Clear up the project
        vm.projectData = '';
        vm.message = data.message;
      })
  }

  socketio.on('project', function(data) {
    vm.projects.push(data);
  })

})

.controller('AllProjectsController', function(projects, socketio) {
  var vm = this;
  vm.projects = projects.data;

  socketio.on('project', function(data) {
    vm.projects.push(data);
  })
})

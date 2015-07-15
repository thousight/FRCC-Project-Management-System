angular.module('projectCtrl', ['projectService'])

.controller('ProjectController', function(Project, socketio) {
  var vm = this;
  Project.all()
    .success(function(data) {
      vm.projects = data;
    })

  vm.createProject = function() {

    // Wrong due date prevention
    var start = new Date(vm.projectData.start_date);
    var due = new Date(vm.projectData.due_date);
    console.log(start);
    if (start > due) {
      alert("Due date can't be earlier than start date, please decide a new due date.");
      return;
    }

    // Create project
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

angular.module('projectCtrl', ['projectService'])

.controller('ProjectController', function(Project, Task, socketio) {
  var vm = this;

  // Projects
  Project.getProjects()
  .success(function(data) {
    vm.projects = data;
  })

  vm.createProject = function() {
    // Wrong due date prevention
    var start = new Date(vm.projectData.start_date);
    var due = new Date(vm.projectData.due_date);
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
      $('#createProject').modal('hide');
    })
  }

  vm.deleteProject = function(id) {
    if (confirm("Are you sure you want to delete this project? If you do, all related tasks and followups will also be deleted.")) {
      Project.deleteProject(id);
      Task.deleteAllTasks(id);
      location.reload();
    } else {
      return;
    }
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

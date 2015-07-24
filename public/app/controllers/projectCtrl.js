angular.module('projectCtrl', ['projectService'])

.controller('ProjectController', function(Project, Task, socketio) {
  var vm = this;
  Project.all()
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

  Task.all()
  .success(function(data) {
    vm.tasks = data;
  })

  vm.createTask = function() {
    // Wrong due date prevention
    var start = new Date(vm.taskData.taskStart_date);
    var due = new Date(vm.taskData.taskDue_date);
    if (start > due) {
      alert("Due date can't be earlier than start date, please decide a new due date.");
      return;
    }
    // Create task
    vm.message = '';
    Task.create(vm.taskData)
    .success(function(data) {
      // Clear up the task
      vm.taskData = '';
      vm.message = data.message;
      $('#createTask').modal('hide');
    })
  }

  socketio.on('project', 'task', function(data) {
    vm.projects.push(data);
    vm.tasks.push(data);
  })

})

.controller('AllProjectsController', function(projects, socketio) {
  var vm = this;
  vm.projects = projects.data;

  socketio.on('project', function(data) {
    vm.projects.push(data);
  })
})

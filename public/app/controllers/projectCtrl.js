angular.module('projectCtrl', ['projectService', '$filter'])

.controller('ProjectController', function(Project, Task, socketio) {
  var vm = this;

  // Get projects
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

  vm.updateProject = function(id) {
    vm.message = '';
    vm.projectData._id = id;
    Project.create(vm.projectData)
    .success(function(data) {
      // Clear up the project
      vm.projectData = '';
      vm.message = data.message;
      var modalName = '#updateProject' + id;
      $(modalName).modal('hide');
    })
  }

  vm.percentage = function(id) {
    return 60;
  }

  vm.completeProject = function(id) {
    if(percentage(id) = 100) {
      
      vm.projectData._id = id;

      var now = new Date();
      var today_obj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      today_obj = $filter('date')(today_obj, "MMM dd, yyyy");
      vm.projectData.complete_date  = String(today_obj);

      Project.completeProject(vm.projectData)
      .success(function(data) {
        // Clear up the project
        vm.projectData = '';
        vm.message = data.message;
      })
    } else {
      return "There are still tasks to be finished, complete them first.";
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

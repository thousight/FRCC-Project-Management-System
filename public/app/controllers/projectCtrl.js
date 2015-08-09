var taskLength;
var projectLength;

angular.module('projectCtrl', ['projectService'])

.controller('ProjectController', function(Project, Task, Followup, socketio, $filter, $scope) {
  var vm = this;

  var projectTasks;

  // Get tasks
  Task.getTasks()
  .success(function(data) {
    vm.projectTasks = data;
    taskLength = vm.projectTasks.length;
  })

  // Get projects
  Project.getProjects()
  .success(function(data) {
    vm.projects = data;
    projectLength = vm.projects.length;
    for (var i = 0; i < projectLength; i++){
      vm.projects[i].percentage = vm.percentage(vm.projects[i]._id);
    }
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

      var deleteAllFollowupsWithProjectID = function(id) {
        for (var i = 0; i < vm.projectTasks.length; i++){
          if (vm.projectTasks[i].taskProjectID == id) {
            Followup.deleteAllFollowups(vm.projectTasks[i]._id);
          }
        }
      }

      deleteAllFollowupsWithProjectID(id);

      location.reload();
    } else {
      return;
    }
  }

  // Finding the specific project from vm.projects
  var findProject = function(id) {
    for (var i = 0; i < vm.projects.length; i++) {
      if (vm.projects[i]._id == id) {
        return vm.projects[i];
      }
    }
  }

  // Parsing data to data model
  vm.preUpdateProject = function(id) {
    var theProject = findProject(id);

    vm.updateProjectData = {
      title: theProject.title,
      short_description: theProject.short_description,
      description: theProject.description,
      priority: theProject.priority,
      assign_dept: theProject.assign_dept,
      start_date: new Date(theProject.start_date),
      due_date: new Date(theProject.due_date)
    };
  }

  vm.updateProject = function(id) {
    vm.message = '';
    vm.updateProjectData._id = id;
    Project.updateProject(vm.updateProjectData)
    .success(function(data) {
      // Clear up the projectData
      vm.updateProjectData = '';
      vm.message = data.message;
      var modalName = '#updateProject' + id;
      $(modalName).modal('hide');
      location.reload();
    })
  }

  vm.percentage = function(id) {
    var totalTasks = 0;
    var completedTasks = 0;

    for (var i = 0; i < taskLength; i++) {
      if (vm.projectTasks[i].taskProjectID == id) {
        totalTasks++;
        if (vm.projectTasks[i].complete_date != "Incomplete") {
          completedTasks++;
        }
      }
    }

    return 100 * (completedTasks / totalTasks);
  }

  vm.completeProject = function(id) {
    if (vm.percentage(id) == 100) {
      var now = new Date();
      var today_obj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      today_obj = $filter('date')(today_obj, "MMM d, yyyy");
      complete_date  = String(today_obj);

      console.log(id);
      console.log(complete_date);
      Project.completeProject(id, complete_date);
      location.reload();
    } else {
      alert("There are still tasks to be finished, complete them first.");
      return;
    }
  }

  socketio.on('project', function(data) {
    vm.projects.push(data);
  })

})

.controller('AllProjectsController', function(projects, socketio, $controller) {
  var vm = this;
  vm.projects = projects.data;

  socketio.on('project', function(data) {
    vm.projects.push(data);
  })
})

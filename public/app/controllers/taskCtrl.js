angular.module('taskCtrl', ['projectService'])

.controller('TaskController', function(Task, socketio, $filter) {
  var vm = this;
  Task.getTasks()
  .success(function(data) {
    vm.tasks = data;
  })

  vm.createTask = function(ProjectID) {
    // Wrong due date prevention
    var start = new Date(vm.taskData.taskStart_date);
    var due = new Date(vm.taskData.taskDue_date);
    if (start > due) {
      alert("Due date can't be earlier than start date, please decide a new due date.");
      return;
    }
    vm.taskData.taskProjectID = ProjectID;
    // Create task
    vm.message = '';
    Task.create(vm.taskData)
    .success(function(data) {
      // Clear up the task
      vm.taskData = '';
      vm.message = data.message;
      var modalName = '#createTask' + ProjectID;
      $(modalName).modal('hide');
    })
  }

  vm.deleteOneTask = function(id) {
    if (confirm("Are you sure you want to delete this task? If you do, all related followups will also be deleted.")) {
      Task.deleteOneTask(id);
      location.reload();
    } else {
      return;
    }
  }

  vm.completeTask = function(id) {
    var now = new Date();
    var today_obj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    today_obj = $filter('date')(today_obj, "MMM d, yyyy");
    var complete_date  = String(today_obj);

    Task.completeTask(id, complete_date)
    .success(function(data) {
      // Clear up the project
      vm.taskData = '';
      vm.message = data.message;
    })
  }

  socketio.on('task', function(data) {
    vm.tasks.push(data);
  })

})

.controller('AllTasksController', function(tasks, socketio) {
  var vm = this;
  vm.tasks = tasks.data;

  socketio.on('task', function(data) {
    vm.tasks.push(data);
  })
})

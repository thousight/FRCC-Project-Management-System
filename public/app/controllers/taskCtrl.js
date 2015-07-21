angular.module('taskCtrl', ['taskService'])

.controller('TaskController', function(Task, socketio) {
  var vm = this;
  Task.all()
    .success(function(data) {
      vm.tasks = data;
    })

  vm.createTask = function() {

    // Wrong due date prevention
    var start = new Date(vm.taskData.start_date);
    var due = new Date(vm.taskData.due_date);
    console.log(start);
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
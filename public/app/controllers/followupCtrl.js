angular.module('followupCtrl', ['projectService'])

.controller('FollowupController', function(Followup, socketio, $filter) {
  var vm = this;
  Followup.getFollowups()
  .success(function(data) {
    vm.followups = data;
  })

  vm.createFollowup = function(TaskID) {
    vm.followupData.followupTaskID = TaskID;
    // Create task
    vm.message = '';
    Followup.create(vm.followupData)
    .success(function(data) {
      // Clear up the task
      vm.followupData = '';
      vm.message = data.message;
      var modalName = '#createFollowup' + TaskID;
      $(modalName).modal('hide');
    })
  }

  vm.deleteOneFollowup = function(id) {
    if (confirm("Are you sure you want to delete this followup?")) {
      Followup.deleteOneFollowup(id);
      location.reload();
    } else {
      return;
    }
  }

  vm.completeFollowup = function(id) {
    var now = new Date();
    var today_obj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    today_obj = $filter('date')(today_obj, "MMM d, yyyy");
    var complete_date  = String(today_obj);

    Followup.completeFollowup(id, complete_date)
    .success(function(data) {
      // Clear up the project
      vm.taskData = '';
      vm.message = data.message;
    })
  }

  socketio.on('followup', function(data) {
    vm.followups.push(data);
  })

})

.controller('AllFollowupsController', function(followups, socketio) {
  var vm = this;
  vm.followups = followups.data;

  socketio.on('followup', function(data) {
    vm.followups.push(data);
  })
})

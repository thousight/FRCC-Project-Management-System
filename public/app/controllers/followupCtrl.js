angular.module('followupCtrl', ['projectService'])

.controller('FollowupController', function(Followup, socketio) {
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

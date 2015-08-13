angular.module('idToName', ['userService'])

.filter('idToName', function(User) {
  User.allUsers()
  .success(function(data) {
    userData = data;
  })
  var assignee;
  return function(IDs) {
    for (var j = 0; j < userData.length; i++) {
      for (var i = 0; i < IDs.length; j++){
        if (IDs[i] == userData[j]._id) {
          assignee[i] = userData[j].firstname + ' ' + userData[j].lastname + ' ' + userData[j].cname;
        }
      }
    }
    return assignee;
  }
})

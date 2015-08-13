angular.module('idToName', [])

.filter('idToName', function() {
  return function(IDs, userData) {
    var assignee = [];
    for (var i = 0; i < IDs.length; i++) {
      for (var j = 0; j < userData.length; j++) {
        if (IDs[i] === userData[j]._id) {
          assignee[i] = userData[j].firstname + ' ' + userData[j].lastname + ' ' + userData[j].cname;
        }
      }
    }
    return assignee;
  }
})

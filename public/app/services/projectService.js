angular.module('projectService', [])

.factory('Project', function($http) {
  var projectFactory = {};
  projectFactory.create = function(projectData) {
    return $http.post('/api', projectData);
  }
  projectFactory.allProject = function() {
    return $http.get('/api');
  }
  return projectFactory;
})

.factory('socketio', function($rootScope) {
  var socket = io.connect();
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        })
      })
    },

    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.apply(function() {
          if(callback) {
            callback.apply(socket, args);
          }
        })
      })
    }
  }
})

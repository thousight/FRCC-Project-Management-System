angular.module('projectService', [])

.factory('Project', function($http) {
  var projectFactory = {};
  projectFactory.create = function(projectData) {
    return $http.post('/api', projectData);
  }
  projectFactory.allProjects = function() {
    return $http.get('/api/all_projects');
  }
  projectFactory.all = function() {
    return $http.get('/api');
  }
  return projectFactory;
})

.factory('Task', function($http) {
  var taskFactory = {};
  taskFactory.create = function(taskData) {
    return $http.post('/api', taskData);
  }
  taskFactory.allTasks = function() {
    return $http.get('/api/all_tasks');
  }
  taskFactory.all = function() {
    return $http.get('/api');
  }
  return taskFactory;
})

.factory('socketio', function($rootScope) {
  var socket = io.connect();
  return {
    on: function(eventName, callback) {
          socket.on(eventName, function() {
            var args = arguments;
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

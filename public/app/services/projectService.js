angular.module('projectService', [])

.factory('Project', function($http) {
  var projectFactory = {};
  projectFactory.create = function(projectData) {
    return $http.post('/api/projects', projectData);
  }
  projectFactory.allProjects = function() {
    return $http.get('/api/all_projects');
  }
  projectFactory.getProjects = function() {
    return $http.get('/api/projects');
  }
  projectFactory.deleteProject = function(id) {
    return $http.post('/api/deleteProject', {id: id});
  }
  return projectFactory;
})

.factory('Task', function($http) {
  var taskFactory = {};
  taskFactory.create = function(taskData) {
    return $http.post('/api/tasks', taskData);
  }
  taskFactory.allTasks = function() {
    return $http.get('/api/all_tasks');
  }
  taskFactory.getTasks = function() {
    return $http.get('/api/tasks');
  }
  taskFactory.deleteAllTasks = function(id) {
    return $http.post('/api/deleteAllTasks', {projectID: id});
  }
  taskFactory.deleteOneTask = function(id) {
    return $http.post('/api/deleteOneTask', {id: id});
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

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
  projectFactory.updateProject = function(projectData) {
    return $http.post('/api/updateProject', projectData);
  }
  projectFactory.completeProject = function(projectData) {
    return $http.post('/api/completeProject', projectData);
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
  taskFactory.completeTask = function(id, complete_date) {
    return $http.post('/api/completeTask', {
      id: id,
      complete_date: complete_date
    });
  }
  taskFactory.countTotalTask = function(id) {
    return $http.post('/api/countTotalTask', {id: id});
  }
  taskFactory.countCompletedTask = function(id) {
    return $http.post('/api/countCompletedTask', {id: id});
  }
  return taskFactory;
})

.factory('Followup', function($http) {
  var followupFactory = {};
  followupFactory.create = function(followupData) {
    return $http.post('/api/followups', followupData);
  }
  followupFactory.allFollowups = function() {
    return $http.get('/api/all_followups');
  }
  followupFactory.getFollowups = function() {
    return $http.get('/api/followups');
  }
  followupFactory.deleteAllFollowups = function(id) {
    return $http.post('/api/deleteAllFollowups', {taskID: id});
  }
  followupFactory.deleteOneFollowup = function(id) {
    return $http.post('/api/deleteOneFollowup', {id: id});
  }
  followupFactory.completeFollowup = function(id, complete_date) {
    return $http.post('/api/completeFollowup', {
      id: id,
      complete_date: complete_date
    });
  }
  return followupFactory;
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

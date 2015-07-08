angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/views/pages/home.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .when('/login', {
      templateUrl: 'app/views/pages/login.html'
    })
    .when('/signup', {
      templateUrl: 'app/views/pages/signup.html'
    })
    .when('/logout', {
      templateUrl: 'app/views/pages/logout.html'
    })
    .when('/allProjects', {
      templateUrl: 'app/views/pages/allProjects.html',
      controller: 'AllProjectsController',
      controllerAs: 'project',
      resolve: {
        projects: function(Project) {
          return Project.allProjects();
        }
      }
    })


  $locationProvider.html5Mode(true);
})

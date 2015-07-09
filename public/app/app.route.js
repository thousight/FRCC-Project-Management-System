angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/views/pages/home.html',
      controller: 'MainController',
      controllerAs: 'main'
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

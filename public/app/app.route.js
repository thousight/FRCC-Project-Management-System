angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/app/views/pages/home.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .when('/allProjects', {
      templateUrl: '/app/views/pages/allProjects.html',
      controller: 'AllProjectsController',
      controllerAs: 'project'
    })
    .when('/allUsers', {
      templateUrl: '/app/views/pages/allUsers.html',
      controller: 'AllUsersController',
      controllerAs: 'user'
    })


  $locationProvider.html5Mode(true);
})

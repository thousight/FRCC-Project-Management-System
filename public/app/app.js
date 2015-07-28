angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'projectService', 'projectCtrl', 'taskCtrl'])

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

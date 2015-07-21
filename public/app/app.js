angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'projectService', 'projectCtrl', 'reverseDirective', 'taskCtrl', 'taskService'])

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

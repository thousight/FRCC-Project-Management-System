angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'projectService', 'projectCtrl'])

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

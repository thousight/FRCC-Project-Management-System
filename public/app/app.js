angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'projectService', 'projectCtrl', 'reverseDirective'])

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

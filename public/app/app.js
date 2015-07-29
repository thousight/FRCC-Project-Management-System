angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'projectService', 'projectCtrl', 'taskCtrl', 'followupCtrl'])

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

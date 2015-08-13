angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'projectService', 'projectCtrl', 'taskCtrl', 'followupCtrl', 'idToName'])

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

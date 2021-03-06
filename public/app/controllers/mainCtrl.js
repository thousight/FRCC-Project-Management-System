angular.module('mainCtrl', [])


.controller('MainController', function($rootScope, $location, Auth) {
  var vm = this; // this = controller
  vm.loggedIn = Auth.isLoggedIn();
  $rootScope.$on('$routeChangeStart', function() {
    vm.loggedIn = Auth.isLoggedIn();
    Auth.getUser()
      .then(function(data) {
        vm.user = data.data;
      })
  })

  // When login, user clicks "submit"
  vm.doLogin = function() {
    vm.processing = true;
    vm.error = "";
    Auth.login(vm.loginData.username, vm.loginData.password)
      .success(function(data){
        vm.processing = false;
        Auth.getUser()
          .then(function(data){
            vm.user = data.data;
          });
        if(data.success) {
          $location.path('/');
          location.reload();
        } else {
          alert(data.message);
        }
      })
  }

  vm.doLogout = function() {
    Auth.logout();
    $location.path('/');
    location.reload();
  }
})

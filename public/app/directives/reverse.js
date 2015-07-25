angular.module('reverseDirective', [])

.filter('reverse', function() {
  return function(items) {
    if (!items || !items.length) { return; }
    return items.slice().reverse();
  }
})

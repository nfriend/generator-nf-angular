'use strict';

// Declare app level module which depends on filters, and services
angular.module('<%= _.camelize(_.slugify(appName)) %>', [
    'ngRoute',
    '<%= _.camelize(_.slugify(appName)) %>.filters',
    '<%= _.camelize(_.slugify(appName)) %>.services',
    '<%= _.camelize(_.slugify(appName)) %>.directives',
    '<%= _.camelize(_.slugify(appName)) %>.controllers'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', { templateUrl: 'views/view1.html', controller: 'MyController1' });
    $routeProvider.when('/view2', { templateUrl: 'views/view2.html', controller: 'MyController2' });
    $routeProvider.otherwise({ redirectTo: '/view1' });
}]);

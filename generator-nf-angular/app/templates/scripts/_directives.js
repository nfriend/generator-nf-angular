'use strict';

angular.module('<%= _.camelize(_.slugify(appName)) %>.directives', []).
directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
        elm.text(version);
    };
}]);

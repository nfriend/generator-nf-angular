/// <reference path='../definitions/references.d.ts' />

'use strict';

angular.module('<%= _.camelize(_.slugify(appName)) %>.filters').
filter('interpolate', ['version', function (version) {
    return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    };
}]);

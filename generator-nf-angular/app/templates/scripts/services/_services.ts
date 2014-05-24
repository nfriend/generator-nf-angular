/// <reference path='../definitions/references.d.ts' />

'use strict';

angular.module('<%= _.camelize(_.slugify(appName)) %>.services')
    .factory('version', function () {
        return '0.1';
    });

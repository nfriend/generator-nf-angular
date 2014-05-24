/// <reference path='definitions/references.d.ts' />

'use strict';

angular.module('<%= _.camelize(_.slugify(appName)) %>.controllers', []);
angular.module('<%= _.camelize(_.slugify(appName)) %>.services', []);
angular.module('<%= _.camelize(_.slugify(appName)) %>.filters', []);
angular.module('<%= _.camelize(_.slugify(appName)) %>.directives', []);
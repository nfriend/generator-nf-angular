'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var NfAngularGenerator = yeoman.generators.Base.extend({
    init: function () {
        this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

        this.on('end', function () {

            //if (!this.options['skip-install']) {
            //    this.npmInstall();
            //}

            this.installDependencies({
                skipInstall: this.options['skip-install'],
                callback: function () {
                    this.spawnCommand('grunt', ['default']);
                }.bind(this) // bind the callback to the parent scope
            });
        });
    },

    askFor: function () {
        var done = this.async();

        // have Yeoman greet the user
        console.log(this.yeoman);

        // replace it with a short and sweet description of your generator
        console.log(chalk.magenta('You\'re using Nathan Friend\'s fantastic Angular generator.'));

        var prompts = [{
            name: 'appName',
            message: 'What would you like to call your Angular app?',
            validate: function (input) {
                if (!input || input === '') {
                    return 'Your app\'s name can\'t be empty.  Please enter a name.';
                }

                // the next three rules ensure that a the slugified name is a valid CSS selector
                // and that its camelcase'd version is a valid JavaScript variable name
                if (!(/[a-zA-Z]/.test(input.substring(0, 1)))) {
                    return "Your app\'s name must begin with a letter!";
                }

                return true;
            }
        }, {
            type: 'confirm',
            name: 'useTypeScript',
            message: 'Would you like to use TypeScript?',
            default: true
        }];

        this.prompt(prompts, function (props) {
            this.appName = props.appName;
            this.useTypeScript = props.useTypeScript;

            done();
        }.bind(this));
    },

    app: function () {
        this.mkdir('app');
        this.mkdir('test');

        this.mkdir('app/scripts');
        this.mkdir('app/scripts/controllers');
        this.mkdir('app/scripts/directives');
        this.mkdir('app/scripts/filters');
        this.mkdir('app/scripts/services');

        this.mkdir('app/styles');
        this.mkdir('app/fonts');
        this.mkdir('app/images');
        this.mkdir('app/views');

        this.copy('Gruntfile.js', 'Gruntfile.js');
        this.copy('views/view1.html', 'app/views/view1.html');
        this.copy('views/view2.html', 'app/views/view2.html');

        this.template('_bower.json', 'bower.json');
        this.template('_index.html', 'app/index.html');
        this.template('styles/_application.less', 'app/styles/application.less');

        if (this.useTypeScript) {
            this.mkdir('app/scripts/definitions');

            this.copy('Gruntfile-ts.js', 'Gruntfile.js');
            this.copy('scripts/definitions/references.d.ts', 'app/scripts/definitions/references.d.ts');

            this.directory('scripts/definitions/angularjs', 'app/scripts/definitions/angularjs');
            this.directory('scripts/definitions/jasmine', 'app/scripts/definitions/jasmine');
            this.directory('scripts/definitions/jquery', 'app/scripts/definitions/jquery');

            this.template('_package-ts.json', 'package.json');
            this.template('scripts/_app.ts', 'app/scripts/app.ts');
            this.template('scripts/_modules.ts', 'app/scripts/modules.ts');
            this.template('scripts/controllers/_controllers.ts', 'app/scripts/controllers/controllers.ts');
            this.template('scripts/directives/_directives.ts', 'app/scripts/directives/directives.ts');
            this.template('scripts/filters/_filters.ts', 'app/scripts/filters/filters.ts');
            this.template('scripts/services/_services.ts', 'app/scripts/services/services.ts');
            this.template('test/_sanity-check.test.ts', 'test/sanity-check.test.ts');
        } else {
            this.copy('Gruntfile.js', 'Gruntfile.js');

            this.template('_package.json', 'package.json');
            this.template('scripts/_app.js', 'app/scripts/app.js');
            this.template('scripts/_modules.js', 'app/scripts/modules.js');
            this.template('scripts/controllers/_controllers.js', 'app/scripts/controllers/controllers.js');
            this.template('scripts/directives/_directives.js', 'app/scripts/directives/directives.js');
            this.template('scripts/filters/_filters.js', 'app/scripts/filters/filters.js');
            this.template('scripts/services/_services.js', 'app/scripts/services/services.js');
            this.template('test/_sanity-check.test.js', 'test/sanity-check.test.js');
        }
    },

    projectfiles: function () {
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');
        this.copy('bowerrc', '.bowerrc');
        this.copy('gitignore', '.gitignore');
    }
});

module.exports = NfAngularGenerator;

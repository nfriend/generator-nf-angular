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
                    return 'You app\'s name can\'t be empty.  Please enter a name.';
                }

                return true;
            }
        }];

        this.prompt(prompts, function (props) {
            this.appName = props.appName;

            done();
        }.bind(this));
    },

    app: function () {
        this.mkdir('app');

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
        this.copy('.bowerrc', '.bowerrc');

        this.template('_package.json', 'package.json');
        this.template('_bower.json', 'bower.json');
        this.template('_application.less', 'app/styles/application.less');
        this.template('_index.html', 'app/index.html');
    },

    projectfiles: function () {
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');
    }
});

module.exports = NfAngularGenerator;
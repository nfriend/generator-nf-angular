'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        dom_munger: {
            build: {
                options: {
                    read: [
                      { selector: 'link', attribute: 'href', writeto: 'cssRefs', isPath: true },
                      { selector: 'script', attribute: 'src', writeto: 'jsRefs', isPath: true },
                      { selector: 'link', attribute: 'href', writeto: 'cssRefsWithoutPath', isPath: false },
                      { selector: 'script', attribute: 'src', writeto: 'jsRefsWithoutPath', isPath: false }
                    ],
                    remove: ['link', 'script'],
                    append: [
                      { selector: 'head', html: '<link href="application.min.css" rel="stylesheet">' },
                      { selector: 'body', html: '<script src="application.min.js"></script>' }
                    ]
                },
                src: 'app/index.html',
                dest: 'build/index.html'
            },
            devbuild: {
                options: {
                    read: [
                      { selector: 'link', attribute: 'href', writeto: 'cssRefs', isPath: true },
                      { selector: 'script', attribute: 'src', writeto: 'jsRefs', isPath: true },
                      { selector: 'link', attribute: 'href', writeto: 'cssRefsWithoutPath', isPath: false },
                      { selector: 'script', attribute: 'src', writeto: 'jsRefsWithoutPath', isPath: false }
                    ],
                    append: [
                      { selector: 'head', html: '<link href="application.css" rel="stylesheet">' },
                      { selector: 'body', html: '<script src="//localhost:35729/livereload.js"></script>' }
                    ]
                },
                src: 'app/index.html',
                dest: 'devbuild/index.html'
            },
        },

        copy: {
            build: {
                cwd: 'app',
                src: ['fonts/**', 'images/**'],
                dest: 'build',
                expand: true
            },
            devbuild: {
                cwd: 'app',
                src: ['<%= dom_munger.data.jsRefsWithoutPath %>', '<%= dom_munger.data.cssRefsWithoutPath %>', 'fonts/**', 'images/**'],
                dest: 'devbuild',
                expand: true
            },
            fonts: {
                cwd: 'app',
                src: ['fonts/**'],
                dest: 'devbuild',
                expand: true
            },
            images: {
                cwd: 'app',
                src: ['images/**'],
                dest: 'devbuild',
                expand: true
            },
        },

        clean: {
            build: {
                src: ['build']
            },
            devbuild: {
                src: ['devbuild']
            },
            stylesheets: {
                src: ['devbuild/**/*.css', '!build/application.min.css']
            },
            scripts: {
                src: ['devbuild/**/*.js', '!build/application.min.js']
            },
            images: {
                src: ['devbuild/images/**']
            },
            fonts: {
                src: ['devbuild/fonts']
            },
        },

        less: {
            build: {
                files: {
                    'build/application.css': 'app/styles/application.less'
                }
            },
            devbuild: {
                files: {
                    'devbuild/application.css': 'app/styles/application.less'
                }
            }
        },

        autoprefixer: {
            build: {
                cwd: 'build',
                src: ['application.css'],
                dest: 'build',
                expand: true
            },
            devbuild: {
                cwd: 'devbuild',
                src: ['application.css'],
                dest: 'devbuild',
                expand: true
            }
        },

        cssmin: {
            build: {
                src: '<%= dom_munger.data.cssRefs %>',
                dest: 'build/application.min.css'
            }
        },

        uglify: {
            build: {
                src: '<%= dom_munger.data.jsRefs %>',
                dest: 'build/application.min.js'
            }
        },

        watch: {
            options: {
                livereload: true,
                open: true
            },
            build: {
                files: ['app/**'],
                tasks: ['build']
            },
            devbuild: {
                files: ['app/**/*.{html,htm,md,js,json,css,less,sass,scss,png,jpg,jpeg,gif,ico,webp,svg,woff,ttf,eot}', '!app/bower_components/**'],
                tasks: ['dom_munger', 'less:devbuild', 'autoprefixer:devbuild', 'copy:fonts', 'copy:images', 'copy:devbuild']
            }
        },

        connect: {
            devbuild: {
                options: {
                    port: 4000,
                    base: 'devbuild/',
                    hostname: '*'
                }
            },
            build: {
                options: {
                    port: 4000,
                    base: 'build/',
                    hostname: '*'
                }
            }
        },
    });

    grunt.registerTask(
        'build',
        'Compiles all of the assets and copies the files to the build directory',
        ['clean:build', 'dom_munger:build', 'copy:build', 'less:build', 'autoprefixer:build', 'cssmin', 'uglify']
    );

    grunt.registerTask(
        'devbuild',
        'Compiles all of the assets and copies the files to the devbuild directory',
        ['clean:devbuild', 'dom_munger:devbuild', 'copy:devbuild', 'less:devbuild', 'autoprefixer:devbuild']
    );

    grunt.registerTask(
        'serve',
        'Watches the project for changes, automatically builds them and runs a server',
        ['connect:build', 'watch:build']
    );

    grunt.registerTask(
        'servedev',
        'Watches the project for changes, automatically creates a development build and serves the build',
        ['connect:devbuild', 'watch:devbuild']
    );

    grunt.registerTask(
        'default',
        'Builds a development build, and begins serving from the directory',
        ['devbuild', 'servedev']
    );

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-dom-munger');
    grunt.loadNpmTasks('grunt-autoprefixer');
};

'use strict'; 

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // copy
        copy: {
            main: {
                expand: true,
                cwd: './src',
                src: ['./**', '!./offline/**'],
                dest: './build'
            },
        },

        // clean
        clean: { folder : ['./build']},

        'string-replace': {
            dist: {
                files: [{
                    expand: true,
                    cwd: './build',
                    src: '*.html',
                    dest: './build'
                }],
                options: {
                    replacements: [
                        {
                            pattern: '<script src="offline/jquery-3.1.1.js"></script>',
                            replacement: '<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>'
                        },
                        {
                            pattern: '<script src="offline/bootstrap-3.3.7.js"></script>',
                            replacement: '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>'
                        },
                        {
                            pattern: '<link rel="stylesheet" type="text/css" href="offline/bootstrap-3.3.7.css">',
                            replacement: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">'
                        }
                        // {
                        //     pattern: '',
                        //     replacement: ''
                        // },
                        // {
                        //     pattern: '',
                        //     replacement: ''
                        // }

                    ]
                }
            }
        },

        uglify: {
            development: {
                files: [{
                    expand: true,
                    cwd: './build/',
                    src: ['**/js/*.js'],
                    dest: './build/'
                }]
            },
            options: {
            }
        },

        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            build: {
                expand: true,
                src: ['./build/js/*.js'],
                dest: ''
            }
        },

        jshint: {
            options: {
                esnext: true
            },
            files: ['src/js/*.js']
        },

        htmlhint: {
            templates: {
                options: {
                    'attr-lower-case': true,
                    'attr-value-not-empty': true,
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'id-class-value': true,
                    'id-class-unique': true,
                    'src-not-empty': true,
                    'img-alt-required': true
                },
                src: ['./src/*.html']
            }
        },

        htmlmin: {
            dev: {
                options: {
                    removeRedundantAttributes: true,
                    removeComments: true,
                    removeOptionalTags: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    src: './build/*.html',
                    dest: ''
                }]
            }
        }
    });




    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('js-hint', ['jshint']);
    grunt.registerTask('html-hint', ['htmlhint']);
    grunt.registerTask('build', ['clean', 'copy', 'string-replace', 'babel', 'uglify', 'htmlmin']);
};
'use strict'

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// copy
		copy: {
			main: {
				expand: true,
				cwd: './src',
				src: ['./**', '!./offline/**', '!./data/**'],
				dest: './build'
			}
		},

		// concat
		concat: {
			js: {
				src: [
					// in this order...
					'./build/js/SoundTouch-merged.js',
					'./build/js/wavesurfer.js',
					'./build/js/wavesurfer-regions.js',
					'./build/js/jquerymods.js',
					'./build/js/dropZone.js',
					'./build/js/main.js'
				],
				dest: './build/js/concat.js'
			},
			css: {
				src: './build/css/*.css',
				dest: './build/css/concat.css'
			}
		},

		// clean

		clean: {
			folder: ['./build']
			// dist2: {
			//     contents : ['build/js/*.js', '!build/js/*.min.js']
			// }
		},

		'string-replace': {
			dist: {
				files: [
					{
						expand: true,
						cwd: './build',
						src: '*.html',
						dest: './build'
					}
				],
				options: {
					replacements: [
						{
							pattern: '<script src="offline/jquery-3.1.1.js"></script>',
							replacement:
								'<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>'
						},
						{
							pattern: '<script src="offline/bootstrap-3.3.7.js"></script>',
							replacement:
								'<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>'
						},
						{
							pattern: '<link rel="stylesheet" type="text/css" href="offline/bootstrap-3.3.7.css">',
							replacement:
								'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">'
						},

						// get concat js files
						{
							pattern:
								'<script src="js/SoundTouch-merged.js"></script><script src="js/wavesurfer.js"></script><script src="js/wavesurfer-regions.js"></script><script src="js/jquerymods.js"></script><script src="js/dropZone.js"></script><script src="js/main.js"></script>',
							replacement: '<script src="js/concat.min.js"></script>'
						},
						// get concat css files
						{
							pattern: '<link rel="stylesheet" type="text/css" href="css/myCss.css">',
							replacement: '<link rel="stylesheet" type="text/css" href="css/concat.css">'
						}
					]
				}
			}
		},

		uglify: {
			development: {
				files: [
					{
						// expand: true,
						// cwd: './build/',
						src: 'build/js/concat.js',
						dest: 'build/js/concat.min.js'
					}
				]
			},
			options: {}
		},

		babel: {
			options: {
				sourceMap: false,
				presets: ['es2015']
			},
			build: {
				expand: true,
				src: 'build/js/concat.js',
				dest: ''
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
				files: [
					{
						expand: true,
						src: './build/*.html',
						dest: ''
					}
				]
			}
		}
	})

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-contrib-clean')
	grunt.loadNpmTasks('grunt-string-replace')
	grunt.loadNpmTasks('grunt-babel')
	grunt.loadNpmTasks('grunt-contrib-htmlmin')

	grunt.registerTask('build', ['clean', 'copy', 'string-replace', 'concat', 'babel', 'uglify', 'htmlmin']) // old

	// grunt.registerTask('build', ['clean:dist1', 'clean:dist2']);
}

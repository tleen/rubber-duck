module.exports = function(grunt){
  'use strict';

  grunt.initConfig({
    jshint : {
      all : {
	files : {
	  src : ['Gruntfile.js', 'index.js', 'templates.json', 'test/index.js', 'test/transcript.json', 'examples/*.js']
	},
	options : {
	  node : true
	}
      }
    },
    test : {
      options : {
	require : ['should'],
	ui : 'bdd',
	reporter : 'spec'
      },
      all : {
	src : 'test/index.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-cafe-mocha');
  grunt.renameTask('cafemocha', 'test');
  
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'test']);
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  
      pkg: grunt.file.readJSON('package.json'),

	  meta: {
		banner: ';'
	  },
	  
    jshint: {
      all: ['src/coda.js']
    },
    
    copy: {
    	build: {
    		files: [
    			{src: ['src/coda.js'],dest: 'dist/coda.js'},
    			{src: ['index.html'],dest: 'dist/index.html'}
    		]
    	},
    	release: {
    		files: [
    			{ expand: true,
    			  flatten: true,
    			  src: ['dist/*'], dest: '../../<%= pkg.name %>/<%= pkg.version %>/'}
    		]
    	}    },

	jshint: {
		files: ['src/*'],
		options: {
		  curly: true,
		  eqeqeq: true,
		  immed: true,
		  latedef: true,
		  newcap: true,
		  noarg: true,
		  sub: true,
		  undef: true,
		  eqnull: true,
		  browser: true,
			globals: {
				console: true,
				MTVN: true,
			}
		}
	},
    
	qunit: {
		all: ['test/qunit.html'],
		min: ['test/qunit.min.html']		
	},

	clean: {
		dist: ['dist/'],
		npm: ['node_modules/'],
		'final': ['../../<%= pkg.name %>/<%= pkg.version %>/'],
	},
		
	uglify: {
    	min: {
    	  src: ['<banner>','src/coda.js'],
    	  dest: 'dist/coda.min.js'
    	}   	
  	},
  	
  	watch: {
  		files: 'src/coda.js',
  		tasks: ['jshint', 'qunit']
  	}
    
    
  });

	grunt.registerTask('build', ['clean:dist', 'jshint', 'qunit:all', 'copy:build', 'uglify', 'qunit:min']);


	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');

}
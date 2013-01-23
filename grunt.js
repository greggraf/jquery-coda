module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
	  meta: {
		banner: ';'
	  },
    lint: {
      all: ['src/coda.js']
    },
    
    concat: {
      dist: {
        src: ['src/coda.js'],
        dest: 'dist/<%= pkg.version %>/coda.js'
      }
    },

	jshint: {
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
		  browser: true
		},
		globals: {
			console: true
		}
	},
    
	qunit: {
		all: ['test/*.html']
	},
	
	min: {
    	dist: {
    	  src: ['<banner>','src/coda.js'],
    	  dest: 'dist/<%= pkg.version %>/coda.min.js'
    	}
  	},
  	
  	watch: {
  		files: 'src/coda.js',
  		tasks: 'lint'
  	}	
    
    
  });
}
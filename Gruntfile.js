module.exports = function(grunt) {

  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    "babel": {
      options: {
        sourceMap: true,
        presets: ["minify"]
        //presets: ['@babel/preset-env']
      },
      dist: {
        files: [
          {
            src: 'dist/vi-filter-bar.js', 
            dest: 'dist/vi-filter-bar.min.js',   
          },
        ]
      }
    },
    "concat": {
      bar: {
        src: ['src/*.js', 'src/filterTypes/*.js'],
        dest: 'dist/vi-filter-bar.js',
      },
    },
    'copy':{
      main:{
        files:
        [
          {expand: true, src: 'assets/*', dest: 'dist/', cwd: 'src', filter: 'isFile'},
          {expand: true, src: '*.css', dest: 'dist/css', cwd: 'src', filter: 'isFile'}
        ]
      }
    }
    
    
  });

  // Load the plugin that provides the "uglify" task.
  
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  //Grunt version plugin
  //grunt.loadNpmTasks('grunt-version');

  // Default task(s).
  grunt.registerTask('default', ['concat','babel', 'copy']);
  

  
};
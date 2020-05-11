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
            src: 'dist/short.js', 
            dest: 'dist/vi-filter-bar.min.js',   
          },
        ]
      }
    },
    "concat": {
      bar: {
        src: ['src/*.js'],
        dest: 'dist/short.js',
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  //Grunt version plugin
  //grunt.loadNpmTasks('grunt-version');

  // Default task(s).
  grunt.registerTask('default', ['concat','babel']);
  

  
};
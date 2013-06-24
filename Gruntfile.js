function loadFrom(path, config) {
  var glob = require('glob'),
  object = {};

  glob.sync('*', {cwd: path}).forEach(function(option) {
    var key = option.replace(/\.js$/,'');
    config[key] = require(path + option);
  });
}

module.exports = function(grunt) {
  var config = {
    pkg: grunt.file.readJSON('package.json'),
    env: process.env,
    clean: ['tmp']
  };

  loadFrom('./tasks/options/', config);

  grunt.initConfig(config);

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build',   [
                     'clean',
                     'transpile',
                     'copy',
                     'ember_handlebars:compile',
                     'sass:app',
                     'concat']);

  grunt.registerTask('test',    ['build',  'qunit:all']);
  grunt.registerTask('server',  ['build', 'connect', 'watch']);
}; 

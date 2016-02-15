var debug = require('debug')('clite');
var path = require('path');

module.exports = (root) => {
  debug('checking for cli updates');
  // finally, check for available update and returns an instance
  var defaults = require('lodash.defaults');

  var pkg = require(path.resolve(root, 'package.json'));

  if (!process.env['npm_config_node_version']) { // jshint ignore:line
    require('update-notifier')({
      pkg: defaults(pkg, { version: '0.0.0' }),
    }).notify();
  }
};
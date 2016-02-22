'use strict';
var dist = require('./es5') ? 'dist' : 'lib';
require('es6-promise');
var test = require('tap-only');
var proxyquire = require('proxyquire');
var version = proxyquire('../../' + dist + '/version', {
  child_process: {
    exec: function exec(cmd, opts, callback) {
      // return on the stderr
      callback(null, '', 'cannot find ' + cmd);
    }
  }
});

test('test version exceptions', function (t) {
  return version(__dirname + '/../fixtures/dev-package').then(function (res) {
    t.equal(res, 'development', 'handled exceptions and returned dev');
  });
});
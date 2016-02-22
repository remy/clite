'use strict';

var test = require('tap-only');
var sampleArgs = ['node', 'script.js'];
var fixtures = __dirname + '/../fixtures';
var clite = require('../../');

test('throws when no package available', function (t) {
  return clite({}, fixtures + '/no-package').catch(function (e) {
    t.match(e.message, /no such file or directory/, 'throws when no package found');
  });
});

// test('throws when no package available (bad path)', t => {
//   return clite({}, ['random/foo']).catch(e => {
//     t.match(e.message, /no such file or directory/, 'throws when no package found');
//   });
// });

test('loads index.js from project root', function (t) {
  return clite({}, fixtures + '/basic-clite').then(function (res) {
    t.equal(res, 'hello world', 'index.js ran');
  });
});

test('runs internal version logic', function (t) {
  process.argv = sampleArgs.concat('-v');
  return clite({}, fixtures + '/basic-clite').then(function (res) {
    t.equal(res, '1.2.3', 'loaded correct package and returns version');
  });
});
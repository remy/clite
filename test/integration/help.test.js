'use strict';

var test = require('tap-only');
var sampleArgs = ['node', 'script.js'];
var fixtures = __dirname + '/../fixtures';
var clite = require('../../');
var fs = require('fs');
var help = fs.readFileSync(fixtures + '/basic-clite/help/index.txt', 'utf8');
var opts = {
  help: {
    _: 'help/index.txt',
    foo: 'help/foo.txt'
  }
};

test('errors on help', function (t) {
  process.argv = sampleArgs.concat('--help');
  return clite({}, fixtures + '/basic-clite').catch(function (e) {
    t.match(e.message, /no help configured/, 'warns on no help');
  });
});

test('finds help', function (t) {
  process.argv = sampleArgs.concat('--help');
  return clite({
    help: 'help/index.txt'
  }, fixtures + '/basic-clite').then(function (res) {
    t.equal(res, help, 'loaded correct help');
  });
});

test('finds shortcut help', function (t) {
  process.argv = sampleArgs.concat('-h');
  return clite({
    help: 'help/index.txt'
  }, fixtures + '/basic-clite').then(function (res) {
    t.equal(res, help, 'loaded correct help');
  });
});

test('finds default help', function (t) {
  process.argv = sampleArgs.concat('--help');
  return clite(opts, fixtures + '/basic-clite').then(function (res) {
    t.equal(res, help, 'found default help from `_`');
  });
});

test('finds specific help', function (t) {
  process.argv = sampleArgs.concat('--help', 'foo');
  return clite(opts, fixtures + '/basic-clite').then(function (res) {
    t.equal(res, 'foo', 'loaded specific help');
  });
});

test('erros on unknown help', function (t) {
  process.argv = sampleArgs.concat('--help', 'bar');
  return clite(opts, fixtures + '/basic-clite').catch(function (e) {
    t.match(e.message, /"bar" help/, 'warns on missing help');
  });
});
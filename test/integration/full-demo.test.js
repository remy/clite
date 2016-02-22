'use strict';

var test = require('tap-only');
var sampleArgs = ['node', 'script.js'];
var fixtures = __dirname + '/../fixtures';
var clite = require(fixtures + '/basic-clite/cli');

test('throws when no package available', function (t) {
  process.argv = sampleArgs.concat('pass', '-d', '-g=words');
  return clite({
    commands: {
      _: 'index',
      echo: 'echo',
      pass: 'passthrough'
    },
    booleans: ['debug', 'dev'],
    alias: {
      d: 'debug'
    },
    options: ['grep']
  }).then(function (res) {
    t.equal(res.args.grep, 'words', 'options found');
    t.equal(res.args.debug, true, 'debug found');
    t.equal(res.args.dev, false, 'dev set found');
  });
});
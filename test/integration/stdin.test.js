'use strict';

var test = require('tap').test;
var sampleArgs = ['node', 'script.js'];
var fixtures = __dirname + '/../fixtures';
var fs = require('fs');
var body = fs.readFileSync(__filename, 'utf8');
var stdin = require('mock-stdin').stdin();
var clite = require('../../');

test('reads from stdin', function (t) {
  process.argv = sampleArgs.concat('echo');
  delete process.env.TAP; // remove test check in lib/read-stdin

  var p = clite({
    commands: {
      echo: './echo'
    },
    return: true,
  }, fixtures + '/basic-clite').then(function (res) {
    t.equals(res, body, 'echo ran and read from stdin');
    process.env.TAP = '1'; // restore tap
  });

  // send our mocked out stdin
  stdin.send(body, 'ascii');
  stdin.send(null);
  return p;
});
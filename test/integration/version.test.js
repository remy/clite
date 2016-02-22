var test = require('tap-only');
var sampleArgs = ['node', 'script.js'];
var fixtures = __dirname + '/../fixtures';
var clite = require('../../');

test('gets version from package.json', t => {
  process.argv = sampleArgs.concat('--version');
  return clite({}, fixtures + '/basic-clite').then(res => {
    t.equals(res, '1.2.3', 'got version');
  });
});

test('gets version from github when missing from package', t => {
  process.argv = sampleArgs.concat('--version');
  return clite({}, fixtures + '/dev-package').then(res => {
    t.match(res, /^master: /, 'got version');
  });
});

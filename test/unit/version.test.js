var test = require('tap-only');
var proxyquire = require('proxyquire');
var version = proxyquire('../../lib/version', {
  child_process: {
    exec: (cmd, opts, callback) => {
      // return on the stderr
      callback(null, '', 'cannot find ' + cmd);
    }
  }
});

test('test version exceptions', t => {
  return version(__dirname + '/../fixtures/dev-package').then(res => {
    t.equal(res, 'development', 'handled exceptions and returned dev');
  });
});

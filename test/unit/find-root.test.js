var test = require('tap-only');
var findRoot = require('../../lib/find-root');

test('find root from deep', t => {
  var real = '/Users/remy/Sites/clite/test/fixtures/dev-package';
  var paths = [ real + '/repl/node_modules',
     real + '/node_modules',
     '/Users/remy/Sites/clite/test/fixtures/node_modules',
     '/Users/remy/Sites/clite/test/node_modules',
     '/Users/remy/Sites/clite/node_modules',
     '/Users/remy/Sites/node_modules',
     '/Users/remy/node_modules',
     '/Users/node_modules',
     '/node_modules' ];
  return findRoot(paths).then(res => {
    t.equal(res, real, 'found actual package path');
  });
});

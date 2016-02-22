var test = require('tap-only');
var proxyquire = require('proxyquire');

test('update notifier', t => {
  delete process.env['npm_config_node_version']; // jshint ignore:line
  var update = proxyquire('../../lib/update', {
    'update-notifier': opts => {
      t.equal(opts.pkg.version, '1.2.3', 'update received correct version');
      return {
        notify: () => {}
      };
    }
  });

  update(__dirname + '/../fixtures/basic-clite');
  t.end();
});

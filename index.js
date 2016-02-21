var _ = true;
try {
  eval('_=!(o=>o)'); // jshint ignore:line
} catch (e) {}

module.exports = require(_ ? './dist' : './lib');
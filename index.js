var _ = true;
try {
  _=!(o=>o);
} catch (e) {}

module.exports = require(_ ? './dist' : './lib');
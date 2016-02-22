'use strict';

module.exports = findRoot;

const fs = require('then-fs');
const path = require('path');
const debug = require('debug')('clite');

function findRoot(paths) {
  return Promise.resolve().then(() => {
    let root = null;

    do {
      // strip the `node_modules`
      let dir = path.resolve(paths.shift(), '..');
      debug(dir);
      let filename = path.resolve(dir, 'package.json');
      try {
        const stat = fs.statSync(filename);
        if (stat.isFile() && module.id.indexOf(dir) !== 0) {
          root = dir;
          break;
        }
      } catch (e) {
        if (paths.length) {
          return findRoot(paths);
        }

        // FIXME have a more descriptive failure
        throw e;
      }
    } while (paths.length);

    debug('root is %s', root);
    return root;
  });
}

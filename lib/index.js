'use strict';
const parseArgs = require('./args');
const debug = require('debug')('clite');
const getSettings = require('./settings');
const path = require('path');
const findRoot = require('./find-root');
const read = require('./read-stdin');

module.exports = (config, root) => {
  const paths = (root ?
      [path.join(root, 'node_modules')] :
      module.parent.parent.paths).slice(0); // copy
  let settings = getSettings(config);

  return Promise.all([
    parseArgs(process.argv, config),
    read(),
    findRoot(paths).then(res => root = res),
  ])
    .then(res => loadCommand(root, res[0], res[1], settings))
    .then(res => {
      require('./update')(root);
      /* istanbul ignore if */
      if (!settings.return) {
        return console.log(res);
      }

      return res;
    }).catch(e => {
      /* istanbul ignore if */
      if (!settings.return) {
        debug(e.stack);
        console.error(e.message);
        return process.exit(1);
      }
      throw e;
    });
};

function loadCommand(root, args, body, settings) {
  let filename = args.command;
  debug('running ' + filename);
  if (filename.indexOf(':::') === 0) {
    filename = filename.slice(3);
    debug('loading internal module: %s', filename);
    return Promise.resolve(require(filename)(root, args, settings))
      .then(res => {
        /* istanbul ignore if */
        if (!settings.return) {
          console.log(res);
          return process.exit(0);
        }
        return res;
      });
  }

  var pkg = path.resolve(root, filename);
  debug('loading %s', pkg, args);
  return require(pkg)(args, settings, body);
}
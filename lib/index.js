'use strict';
const parseArgs = require('./args');
const debug = require('debug')('clite');
const getSettings = require('./settings');
const path = require('path');
const findRoot = require('./find-root');
const read = require('./read-stdin');

module.exports = (config, root) => {
  const paths = root ?
    [path.join(root, 'node_modules')] :
    module.parent.parent.paths;
  let settings = getSettings(config);

  return Promise.all([
    parseArgs(process.argv, config),
    read(),
    findRoot(paths).then(res => root = res),
  ])
    .then(res => loadCommand(root, res[0], res[1], settings))
    .then(res => {
      require('./update')(root);
      return res;
    }).catch(e => {
      if (settings.return) {
        throw e;
      }
      console.log(e.message);
      process.exit(1);
    });
};

function loadCommand(root, args, body, settings) {
  var filename = args.command;
  debug('running ' + filename);
  if (filename.indexOf(':::') === 0) {
    debug('loading internal module: %s', filename.slice(3));
    return Promise.resolve(require(filename.slice(3))(root, args, settings)).then(res => settings.return ? res : console.log(res));
  }

  debug('loading %s', path.resolve(root, filename), args);
  return require(path.resolve(root, filename))(args);
}
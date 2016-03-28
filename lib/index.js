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
  ]).then(res => {
    let args = res[0].args;
    let help = res[0].help;
    let body = res[1];
    if (!args.$_ && !settings.commands._ && !body) {
      return loadCommand(root, { $_: ':::./help' }, body, settings).catch(e => {
        if (e.code === 'NO_HELP_CONFIGURED') {
          e.message = help.trim();
        }
        throw e;
      }).then(res => {
        var e = new Error(res);
        throw e;
      });
    }

    return loadCommand(root, args, body, settings);
  }).then(res => {
    require('./update')({ root: root });
    /* istanbul ignore if */
    if (!settings.return && res !== undefined) {
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
  var filename = args.$_;

  if (!filename) {
    var error = new Error('No command given');
    error.code = 'NO_COMMAND';
    return Promise.reject(error);
  }

  var internal = filename.indexOf(':::') === 0;
  if (internal) {
    filename = filename.slice(3);
    args.root = root;
    debug('loading internal module: %s', filename);
  } else {
    filename = path.resolve(root, filename);
    debug('loading %s', filename);
  }

  return new Promise(resolve => {
    resolve(require(filename));
  }).catch(e => {
    e.message = `Fatal: command failed to load "${filename}"`;
    throw e;
  }).then(res => res(args, settings, body)).then(res => {
    /* istanbul ignore if */
    if (!settings.return && internal) {
      console.log(res);
      // internal commands always immediately exit
      return process.exit(0);
    }
    return res;
  });
}
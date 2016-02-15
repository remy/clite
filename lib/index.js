'use strict';
const parseArgs = require('./args');
const debug = require('debug')('clite');
const fs = require('then-fs');
const path = require('path');
const defaultsDeep = require('lodash.defaultsdeep');
const root = findRoot(module.parent.parent.paths);

let defaults = {
  flags: ['version', 'help'],
  options: [],
  alias: {},
  commands: {
    version: ':::./version',
    help: ':::./help',
  },
};

module.exports = (config) => {
  checkFor('version', config);
  checkFor('help', config);

  const settings = defaultsDeep(defaults, config);
  return Promise.resolve(parseArgs(process.argv, settings)).then(args => {
    let override = false;

    if (args.help) {
      override = 'help';
    }

    if (args.version) {
      override = 'version';
    }

    const command = settings.commands[override || args._[2]] || settings.commands._ || 'index';
    debug('running ' + command);
    return loadCommand(command, args, settings);
  }).then(res => {
    require('./update')(root);
    return res;
  }).catch(e => {
    console.log(e.message);
    process.exit(1);
  });
};

function checkFor(key, config) {
  if ((config.flags || []).indexOf(key) === -1) {
    return;
  }

  delete defaults.commands[key];
  defaults.flags.splice(defaults.flags.indexOf(key), 1);
}

function loadCommand(filename, args, settings) {
  if (filename.indexOf(':::') === 0) {
    debug('loading internal module: %s', filename.slice(3));
    return Promise.resolve(require(filename.slice(3))(root, args, settings)).then(console.log);
  }

  debug('loading %s', path.resolve(root, filename), args);
  return require(path.resolve(root, filename))(args);
}

function findRoot(paths) {
  var root = null;

  do {
    // strip the `node_modules`
    let dir = path.resolve(paths.shift(), '..');
    let filename = path.resolve(dir, 'package.json');
    try {
      const stat = fs.statSync(filename);
      if (stat.isFile) {
        root = dir;
        break;
      }
    } catch (e) {
      if (paths.length) {
        return findRoot(paths);
      }

      throw e;
    }
  } while (paths.length);

  debug('root is %s', root);
  return root;
}

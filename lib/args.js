'use strict';
module.exports = args;

const debug = require('debug')('clite');
const minimist = require('minimist');
const abbrev = require('abbrev');
const defaultsDeep = require('lodash.defaultsdeep');

function args(argv, options) {
  var settings = {};
  var defaults = require('./defaults')();
  checkFor('version', options, defaults);
  checkFor('help', options, defaults);

  defaultsDeep(settings, options, defaults); // clone

  if (!Array.isArray(argv)) {
    throw new Error('process.argv type expected');
  }

  defaultsDeep(settings.alias, abbrev(settings.options.concat(settings.flags)));
  debug(settings);

  // fixes up any issue
  settings.options.forEach(t => delete settings.alias[t]);

  let res = minimist(argv, {
    string: settings.options,
    alias: settings.alias,
    boolean: settings.flags,
  });

  let override = false;

  if (res.help) {
    override = 'help';
  }

  if (res.version) {
    override = 'version';
  }

  res.command = settings.commands[override || res._[2]] || settings.commands._ || 'index';

  return res;
}

function checkFor(key, config, defaults) {
  if (!config) {
    config = {};
  }

  if ((config.flags || []).indexOf(key) === -1) {
    return;
  }

  debug('stripping internal command');

  delete defaults.commands[key];
  defaults.flags.splice(defaults.flags.indexOf(key), 1);
}
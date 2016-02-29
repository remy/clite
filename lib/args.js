'use strict';
module.exports = args;

const debug = require('debug')('clite');
const minimist = require('minimist');
const abbrev = require('abbrev');
const getSettings = require('./settings');
const defaultsDeep = require('lodash.defaultsdeep');

function args(argv, config) {
  let settings = getSettings(config);
  if (!Array.isArray(argv)) {
    throw new Error('process.argv type expected');
  }

  defaultsDeep(settings.alias,
    abbrev(settings.options.concat(settings.booleans)));

  // fixes up any issue
  settings.options.forEach(t => delete settings.alias[t]);

  debug('config', config);

  let res = minimist(argv, {
    string: settings.options,
    alias: settings.alias,
    boolean: settings.booleans,
  });
  res.argv = res._.slice(0);
  res._.splice(0, 2); // now remove the `node` + script name

  debug('args', res);

  let override = false;

  if (res.help) {
    override = 'help';
    if (res._.length) {
      res.help = res._.pop();
    }
  }

  if (res.version) {
    override = 'version';
  }

  res.command = settings.commands[override ||
                res._[0]] ||
                settings.commands._ ||
                '.'; // aka index

  // if our command was used off the CLI arg, then let's remove it from the
  // command args
  if (res.command === settings.commands[res._[0]]) {
    res._.shift();
  }

  return res;
}
module.exports = getSettings;

const debug = require('debug')('clite');
const defaultsDeep = require('lodash.defaultsdeep');

function getSettings(options) {
  var settings = {};
  var defaults = require('./defaults')();
  checkFor('version', options, defaults);
  checkFor('help', options, defaults);

  defaultsDeep(settings, options, defaults); // clone
  return settings;
}

function checkFor(key, config, defaults) {
  if (!config) {
    config = {};
  }

  if ((config.booleans || []).indexOf(key) === -1) {
    return;
  }

  debug('stripping internal command');

  delete defaults.commands[key];
  defaults.booleans.splice(defaults.booleans.indexOf(key), 1);
}
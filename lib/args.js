module.exports = args;

var minimist = require('minimist');
var abbrev = require('abbrev');
var defaultsDeep = require('lodash.defaultsdeep');

function args(argv, settings) {
  defaultsDeep(settings.alias, abbrev(settings.options.concat(settings.flags)));

  // fixes up any issue
  settings.options.forEach(t => delete settings.alias[t]);

  return minimist(argv, settings);
}
module.exports = function () {
  return {
    flags: ['version', 'help'],
    options: [],
    alias: {},
    commands: {
      version: ':::./version',
      help: ':::./help',
    },
  };
};
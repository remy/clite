var path = require('path');
var exec = require('child_process').exec;

module.exports = function (root) {
  return new Promise(resolve => {
    var filename = path.resolve(root, 'package.json');
    var version = require(filename).version;

    if (version && version !== '0.0.0') {
      return resolve(version);
    }

    // else we're in development, give the commit out
    // get the last commit and whether the working dir is dirty
    var promises = [
      branch(),
      commit(),
      dirty(),
    ];

    resolve(Promise.all(promises).then(res => {
      var branch = res[0];
      var commit = res[1];
      var dirtyCount = parseInt(res[2], 10);
      var curr = `${branch}: ${commit}`;
      if (dirtyCount !== 0) {
        curr += ` (${dirtyCount} dirty files)`;
      }

      return curr;
    }).catch(() => 'development'));
  });
};

function commit(root) {
  return command('git rev-parse HEAD', root);
}

function branch(root) {
  return command('git rev-parse --abbrev-ref HEAD', root);
}

function dirty(root) {
  return command('expr $(git status --porcelain 2>/dev/null| ' +
      'egrep "^(M| M)" | wc -l)', root);
}

function command(cmd, root) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: root }, (err, stdout, stderr) => {
      var error = stderr.trim();
      if (error) {
        return reject(new Error(`${error} / ${cmd}`));
      }
      resolve(stdout.split('\n').join(''));
    });
  });
}


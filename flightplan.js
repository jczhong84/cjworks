// flightplan.js
var plan = require('flightplan');
var username = 'loserford';

// configuration
plan.target('staging', {
  host: 'staging.example.com',
  username: 'pstadler',
  agent: process.env.SSH_AUTH_SOCK
});

plan.target('prod', [
  {
    host: 'cjworks.cloudapp.net',
    username: username,
    password: 'jcZ1234%',
    agent: process.env.SSH_AUTH_SOCK
  }
]);

var tmpDir = 'cjworks-' + new Date().getTime();

// run commands on localhost
plan.local(function(local) {
//  local.log('Run build');
//  local.exec('gulp build');
  local.log('key' + process.env.SSH_AUTH_SOCK);

  local.log('Copy files to remote hosts');
  var filesToCopy = local.exec('git ls-files', {silent: true});
  // rsync files to all the target's remote hosts
  local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

// run commands on the target's remote hosts
plan.remote(function(remote) {
  remote.log('Move folder to web root');
  remote.sudo('cp -R /tmp/' + tmpDir + ' ~', {user: username});
  remote.rm('-rf /tmp/' + tmpDir);

  remote.log('Install dependencies');
  remote.sudo('npm --production --prefix ~/' + tmpDir
                            + ' install ~/' + tmpDir, {user: username});

  remote.log('Reload application');
  remote.sudo('ln -snf ~/' + tmpDir + ' ~/cjworks', {user: username});
  remote.sudo('pm2 restart cjworks', {user: username});
});

// run more commands on localhost afterwards
plan.local(function(local) { /* ... */ });
// ...or on remote hosts
plan.remote(function(remote) { /* ... */ });

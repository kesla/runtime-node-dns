'use strict';

// process.exitCode = 1;

const cp = require('child_process');
const finished = require('tap-finished');
const runtimeify = require('runtimeify');
const split = require('split');
const path = require('path');

runtimeify.builtins.dns = require.resolve('../index');

const qemuPath = path.resolve(__dirname, '../node_modules/.bin/runtime-qemu');

runtimeify({
  file: [__dirname + '/test.js'],
  output :__dirname + '/initrd',
  debug: true
}, function (err) {
  if (err) {
    throw err;
  }

  const qemu = cp.spawn(qemuPath,
    [ `${__dirname}/initrd`, '--verbose', '--nographic' ]
  );

  qemu.stdout.pipe(finished(function (results) {
    process.exitCode = results.ok ? 0 : 1;
    qemu.kill('SIGINT');
  }));

  qemu.stdout.pipe(split()).on('data', function (chunk) {
    if (chunk.toString().indexOf('terminate thread') !== -1) {
      qemu.kill('SIGINT');
    }
  });

  qemu.stdout.pipe(process.stdout);
});

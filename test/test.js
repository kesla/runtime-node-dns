'use strict';

const test = require('tape');
const dns = require('dns');
const isIp = require('is-ip');

test('lookup()', function (t) {
  dns.lookup('images.mic.com', function (err, address, family) {
    if (err) {
      return t.end(err);
    }

    t.ok(isIp.v4(address), 'address is ip4');
    t.equal(family, 4, 'family is 4');

    t.end();
  });
});

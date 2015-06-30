'use strict';

const dns = require('runtimejs').dns;

module.exports = class DNS {
  constructor() {
    this._cache = new Map();
  }

  lookup(hostname, cb) {

    const data = this._cache.get(hostname);

    if (data && data.expires > Date.now()) {
      process.nextTick(function () {
        cb(null, data.address, 4);
      });
      return;
    }

    dns.resolve(hostname, {}, (err, data) => {
      if (err) {
        return cb(err);
      }

      const aRecords = data.results.filter(function (row) {
        return row.record === 'A';
      });
      const record = aRecords[Math.floor(aRecords.length * Math.random())]
      const address = record.address.join('.');

      this._cache.set(hostname, {
        address: address,
        expires: Date.now() + record.ttl
      });
      cb(null, address, 4);
    });
  }
}

'use strict';
const { createHash } = require('node:crypto');

module.exports = function exports (env) {
  const hash = createHash('sha256');
  hash.update(JSON.stringify(env));

  return hash.digest('hex');
};

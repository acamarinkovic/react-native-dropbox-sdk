var nodeFetch = require('node-fetch');

var harness = {
  fetch: nodeFetch
};

function fetch() {
  var args = Array.prototype.slice.call(arguments);
  return harness.fetch.apply(null, args);
}

fetch.harness = harness;

module.exports = fetch;

var nodeFetch = require('node-fetch');

var interface = {
  fetch: nodeFetch
};

function fetch() {
  var args = Array.prototype.slice.call(arguments);
  return interface.fetch.apply(null, args);
}

fetch.interface = interface;

module.exports = fetch;

var nodeFetch = require('node-fetch');

function getFetchMethod() {
  var glb = typeof global !== 'undefined' ? global : window;
  return typeof glb !== 'undefined' && typeof glb.fetch === 'function' ?
    glb.fetch :
    nodeFetch;
}

var harness = {
  fetch: getFetchMethod()
};

function fetch() {
  var args = Array.prototype.slice.call(arguments);
  return harness.fetch.apply(null, args);
}

fetch.harness = harness;

module.exports = fetch;

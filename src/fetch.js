var fetchPolyfill = require('node-fetch');

var theGlobalObject = typeof global !== undefined ? global : window;

function getFetchMethod() {
  if (theGlobalObject) {
    if (typeof theGlobalObject.rnFetch === 'function') {
      return theGlobalObject.rnFetch;
    } else if (typeof theGlobalObject.fetch === 'function') {
      return theGlobalObject.fetch;
    }
  }
  return fetchPolyfill;
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

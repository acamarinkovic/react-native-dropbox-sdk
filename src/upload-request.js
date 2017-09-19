var Promise = require('es6-promise').Promise;
var getBaseURL = require('./get-base-url');
var fetch = require('./fetch');
var httpHeaderSafeJson = require('./http-header-safe-json');

// This doesn't match what was spec'd in paper doc yet
var buildCustomError = function (error) {
  return {
    status: error.status,
    error: error.toString()
  };
};

var uploadRequest = function (path, args, auth, host, accessToken, selectUser) {
  if (auth !== 'user') {
    throw new Error('Unexpected auth type: ' + auth);
  }

  var promiseFunction = function (resolve, reject) {
    // Since args.contents is sent as the body of the request and not added to
    // the url, it needs to be remove it from args.
    var contents = args.contents;
    delete args.contents;

    var fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        Authorization: 'Bearer ' + accessToken,
        'Dropbox-API-Arg': httpHeaderSafeJson(args)
      },
      body: contents
    };

    if (selectUser) {
      fetchOptions.headers['Dropbox-API-Select-User'] = selectUser;
    }

    fetch(getBaseURL(host) + path, fetchOptions)
      .then(function (res) {
        return res.json();
      })
      .then(function (res) {
        resolve(res.body);
      })
      .catch(function (error) {
        reject(buildCustomError(error));
      });
  };

  return new Promise(promiseFunction);
};

module.exports = uploadRequest;

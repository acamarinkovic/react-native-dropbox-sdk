var Promise = require('es6-promise').Promise;
var getBaseURL = require('./get-base-url');
var httpHeaderSafeJson = require('./http-header-safe-json');
var fetch = require('./fetch');

var buildCustomError;
var downloadRequest;

// This doesn't match what was spec'd in paper doc yet
buildCustomError = function (error) {
  return {
    status: error.status,
    error: error.toString()
  };
};

downloadRequest = function (path, args, auth, host, accessToken, selectUser) {
  if (auth !== 'user') {
    throw new Error('Unexpected auth type: ' + auth);
  }

  var promiseFunction = function (resolve, reject) {
    var fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Dropbox-API-Arg': httpHeaderSafeJson(args)
      }
    };

    if (selectUser) {
      fetchOptions.headers['Dropbox-API-Select-User'] = selectUser;
    }

    fetch(getBaseURL(host) + path, fetchOptions)
      .then(function (res) {
        var err;
        if (!res.ok) {
          err = new Error('Request failed');
          err.status = res.status;
          throw err;
        }
        return res;
      })
      .then(function (res) {
        return Promise.all([
          res.buffer && res.buffer() || res.blob(),
          Promise.resolve(res.headers)
        ]);
      })
      .then(function (res) {
        var output = res[0];
        var headers = res[1];
        var data = JSON.parse(headers.get('dropbox-api-result'));
        data.fileBinary = output;
        resolve(data);
      })
      .catch(function (error) {
        reject(buildCustomError(error));
      });
  };

  return new Promise(promiseFunction);
};

module.exports = downloadRequest;

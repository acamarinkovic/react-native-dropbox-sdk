var Promise = require('es6-promise').Promise;
var getBaseURL = require('./get-base-url');
var fetch = require('./fetch');

// This doesn't match what was spec'd in paper doc yet
var buildCustomError = function (error) {
  return {
    status: error.status,
    error: error
  };
};

var rpcRequest = function (path, body, auth, host, accessToken, selectUser) {
  var promiseFunction = function (resolve, reject) {
    // The API expects null to be passed for endpoints that dont accept any
    // parameters
    if (!body) {
      body = null;
    }

    var fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: typeof body !== 'string' ? JSON.stringify(body) : body
    };

    // apiRequest = request.post(getBaseURL(host) + path)
    //   .type('application/json');

    switch (auth) {
      case 'team':
      case 'user':
        fetchOptions.headers.Authorization = 'Bearer ' + accessToken;
        break;
      case 'noauth':
        break;
      default:
        throw new Error('Unhandled auth type: ' + auth);
    }

    if (selectUser) {
      fetchOptions.headers['Dropbox-API-Select-User'] = selectUser;
    }

    fetch(getBaseURL(host) + path, fetchOptions)
      .then(function (res) {
        if (!res.ok) {
          var err = new Error('Request failed');
          err.status = res.status;
          throw err;
        }
        return res;
      })
      .then(function (res) {
        return res.json();
      })
      .then(function (result) {
        resolve(result);
      })
      .catch(function (err) {
        reject(buildCustomError(err));
      });
  };

  return new Promise(promiseFunction);
};

module.exports = rpcRequest;

var Promise = require('es6-promise').Promise;
var getBaseURL = require('./get-base-url');
var httpHeaderSafeJson = require('./http-header-safe-json');
var fetch = require('./fetch');

var buildCustomError;
var downloadRequest;
// var nodeBinaryParser;

// This doesn't match what was spec'd in paper doc yet
buildCustomError = function (error) {
  return {
    status: error.status,
    error: error.toString()
  };
};

// nodeBinaryParser = function (res, done) {
//   res.text = '';
//   res.setEncoding('binary');
//   res.on('data', function (chunk) { res.text += chunk; });
//   res.on('end', function () {
//     done();
//   });
// };

downloadRequest = function (path, args, auth, host, accessToken, selectUser) {
  if (auth !== 'user') {
    throw new Error('Unexpected auth type: ' + auth);
  }

  var promiseFunction = function (resolve, reject) {
    // var apiRequest;

    // function success(data) {
    //   if (resolve) {
    //     resolve(data);
    //   }
    // }

    // function failure(error) {
    //   if (reject) {
    //     reject(error);
    //   }
    // }

    // function responseHandler(error, response) {
    //   var data;
    //   if (error) {
    //     failure(buildCustomError(error, response));
    //   } else {
    //     // In the browser, the file is passed as a blob and in node the file is
    //     // passed as a string of binary data.
    //     data = JSON.parse(response.headers['dropbox-api-result']);
    //     if (response.xhr) {
    //       data.fileBlob = response.xhr.response;
    //     } else {
    //       data.fileBinary = response.res.text;
    //     }
    //     success(data);
    //   }
    // }

    var fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Dropbox-API-Arg': httpHeaderSafeJson(args)
      }
    };

    // apiRequest = request.post(getBaseURL(host) + path)
    //   .set('Authorization', 'Bearer ' + accessToken)
    //   .set('Dropbox-API-Arg', httpHeaderSafeJson(args))
    //   .on('request', function () {
    //     if (this.xhr) {
    //       this.xhr.responseType = 'blob';
    //     }
    //   });

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
      })
      .then(function (res) {
        return Promise.all([
          res.buffer(),
          Promise.resolve(res.headers)
        ]);
      })
      .then(function (res) {
        var output = res[0];
        var headers = res[1];
        var data = JSON.parse(headers['dropbox-api-result']);
        data.fileBinary = output;
        resolve(data);
      })
      .catch(function (error) {
        reject(buildCustomError(error));
      });

    // Apply the node binary parser to the response if executing in node
    // if (typeof window === 'undefined') {
    //   apiRequest
    //     .buffer(true)
    //     .parse(nodeBinaryParser)
    //     .end(responseHandler);
    // } else {
    //   apiRequest.end(responseHandler);
    // }
  };

  return new Promise(promiseFunction);
};

module.exports = downloadRequest;

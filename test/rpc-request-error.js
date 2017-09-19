/* eslint-env mocha */
var chai = require('chai');
var Promise = require('es6-promise').Promise;
var fetch = require('../src/fetch');
var rpcRequest = require('../src/rpc-request');
var sinon = require('sinon');

var assert = chai.assert;

describe('rpcRequest error', function () {
  beforeEach(function () {
    this.fetchStub = sinon.stub(fetch.harness, 'fetch');
  });

  afterEach(function () {
    this.fetchStub.restore();
  });

  it('handles errors in expected format', function (done) {
    var error = new Error('Internal server error');
    error.status = 500;
    this.fetchStub.returns(Promise.reject(error));

    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
      .then(function () {
        done(new Error('shouldn’t reach this callback'));
      })
      .catch(function (err) {
        assert(err);
        assert.equal(err.status, 500);
        done();
      });
  });

  it('handles errors when json cannot be parsed', function (done) {
    var error = new Error('Internal server error');
    error.status = 500;
    this.fetchStub.returns(Promise.reject(error));

    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken')
      .then(function () {
        done(new Error('shouldn’t reach this callback'));
      })
      .catch(function (err) {
        assert(err);
        assert.equal(err.status, 500);
        done();
      });
  });
});

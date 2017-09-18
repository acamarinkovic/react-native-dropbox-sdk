/* eslint-env mocha */
var Promise = require('es6-promise').Promise;
var REQUEST_CONSTANTS = require('../src/request-constants');
var chai = require('chai');
var fetch = require('../src/fetch');
var rpcRequest = require('../src/rpc-request');
var sinon = require('sinon');

var assert = chai.assert;

describe('rpcRequest', function () {
  var postStub;

  beforeEach(function () {
    postStub = sinon.spy(fetch.interface, 'fetch');
  });

  afterEach(function () {
    fetch.interface.fetch.restore();
  });

  it('returns a promise', function () {
    assert.instanceOf(
      rpcRequest(),
      Promise
    );
  });

  it('posts to the correct url', function () {
    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken');
    assert(postStub.calledOnce);
    assert.equal('https://api.dropboxapi.com/2/files/list', postStub.firstCall.args[0]);
  });

  it('sets the request type to application/json', function () {
    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken');
    var options = postStub.firstCall.args[1];
    assert.equal(options.headers['Content-Type'], 'application/json');
  });

  it('sets the authorization header', function () {
    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken');
    var options = postStub.firstCall.args[1];
    assert.equal(options.headers.Authorization, 'Bearer atoken');
  });

  it('sets the authorization and select user headers if selectUser set', function () {
    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken', 'selectedUserId');
    var options = postStub.firstCall.args[1];
    assert.equal(options.headers.Authorization, 'Bearer atoken');
    assert.equal(options.headers['Dropbox-API-Select-User'], 'selectedUserId');
  });

  it('sets the request body', function () {
    rpcRequest('files/list', { foo: 'bar' }, 'user', 'api', 'atoken');
    var options = postStub.firstCall.args[1];
    assert.deepEqual(options.body, { foo: 'bar' });
  });

  it('sets the request body to null if body isn\'t passed', function () {
    rpcRequest('files/list', undefined, 'user', 'api', 'atoken');
    var options = postStub.firstCall.args[1];
    assert.deepEqual(options.body, null);
  });
});

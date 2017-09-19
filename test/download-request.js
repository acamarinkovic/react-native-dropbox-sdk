/* eslint-env mocha */
var Promise = require('es6-promise').Promise;
var chai = require('chai');
var fetch = require('../src/fetch');
var downloadRequest = require('../src/download-request');
var sinon = require('sinon');

var assert = chai.assert;

describe('downloadRequest', function () {
  var fetchStub;

  beforeEach(function () {
    fetchStub = sinon.spy(fetch.harness, 'fetch');
  });

  afterEach(function () {
    fetchStub.restore();
  });

  it('returns a promise', function () {
    assert.instanceOf(
      downloadRequest('path', {}, 'user', 'content', 'atoken'),
      Promise
    );
  });

  it('posts to the correct url', function () {
    downloadRequest('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(fetchStub.calledOnce);
    assert.equal('https://content.dropboxapi.com/2/sharing/get_shared_link_file', fetchStub.firstCall.args[0]);
  });

  // This is just what the API wants...
  it('the request type is not set', function () {
    downloadRequest('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.headers['Content-Type'], undefined);
  });

  it('sets the authorization header', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.headers.Authorization, 'Bearer atoken');
  });

  it('sets the authorization and select user headers if selectUser set', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken', 'selectedUserId');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.headers.Authorization, 'Bearer atoken');
    assert.equal(options.headers['Dropbox-API-Select-User'], 'selectedUserId');
  });

  it('sets the Dropbox-API-Arg header', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.headers['Dropbox-API-Arg'], JSON.stringify({ foo: 'bar' }));
  });

  it('escapes special characters in the Dropbox-API-Arg header', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar单bazá' }, 'user', 'content', 'atoken');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.headers['Dropbox-API-Arg'], '{"foo":"bar\\u5355baz\\u00e1"}');
  });
});

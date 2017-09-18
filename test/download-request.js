/* eslint-env mocha */
var Promise = require('es6-promise').Promise;
var chai = require('chai');
// var request = require('superagent');
var fetch = require('../src/fetch');
var downloadRequest = require('../src/download-request');
var sinon = require('sinon');

var assert = chai.assert;

describe('downloadRequest', function () {
  var stubRequest;
  var postStub;
  var endStub;
  var onStub;
  var setStub;
  var typeStub;
  var bufferStub;
  var parseStub;
  var proxyStub;

  beforeEach(function () {
    stubRequest = {
      end: function () {},
      on: function () {},
      set: function () {},
      type: function () {},
      buffer: function () {},
      parse: function () {},
      proxy: function () {}
    };
    postStub = sinon.spy(fetch.interface, 'fetch');
    endStub = sinon.stub(stubRequest, 'end').returns(stubRequest);
    onStub = sinon.stub(stubRequest, 'on').returns(stubRequest);
    setStub = sinon.stub(stubRequest, 'set').returns(stubRequest);
    typeStub = sinon.stub(stubRequest, 'type').returns(stubRequest);
    bufferStub = sinon.stub(stubRequest, 'buffer').returns(stubRequest);
    parseStub = sinon.stub(stubRequest, 'parse').returns(stubRequest);
  });

  afterEach(function () {
    postStub.restore();
  });

  it('returns a promise', function () {
    assert.instanceOf(
      downloadRequest('path', {}, 'user', 'content', 'atoken'),
      Promise
    );
  });

  it('posts to the correct url', function () {
    downloadRequest('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(postStub.calledOnce);
    assert.equal('https://content.dropboxapi.com/2/sharing/get_shared_link_file', postStub.firstCall.args[0]);
  });

  // This is just what the API wants...
  it('the request type is not set', function () {
    downloadRequest('sharing/get_shared_link_file', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(!typeStub.called);
  });

  it('sets the authorization header', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken');
    var options = postStub.firstCall.args[1];
    assert.equal(options.headers.Authorization, 'Bearer atoken');
  });

  it('sets the authorization and select user headers if selectUser set', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken', 'selectedUserId');
    var options = postStub.firstCall.args[1];
    assert.equal(options.headers.Authorization, 'Bearer atoken');
    assert.equal(options.headers['Dropbox-API-Select-User'], 'selectedUserId');
  });

  it('sets the Dropbox-API-Arg header', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar' }, 'user', 'content', 'atoken');
    var options = postStub.firstCall.args[1];
    assert.equal(options.headers['Dropbox-API-Arg'], JSON.stringify({ foo: 'bar' }));
  });

  it('escapes special characters in the Dropbox-API-Arg header', function () {
    downloadRequest('sharing/create_shared_link', { foo: 'bar单bazá' }, 'user', 'content', 'atoken');
    var options = postStub.firstCall.args[1];
    assert.equal(options.headers['Dropbox-API-Arg'], '{"foo":"bar\\u5355baz\\u00e1"}');
  });
});

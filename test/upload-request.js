/* eslint-env mocha */
var Promise = require('es6-promise').Promise;
var chai = require('chai');
// var request = require('superagent');
var fetch = require('../src/fetch');
var uploadRequest = require('../src/upload-request');
var sinon = require('sinon');

var assert = chai.assert;

describe('uploadRequest', function () {
  // var stubRequest;
  var fetchStub;
  // var endStub;
  // var setStub;
  // var typeStub;
  // var sendStub;
  // var proxyStub;

  beforeEach(function () {
    // stubRequest = {
    //   end: function () {},
    //   send: function () {},
    //   set: function () {},
    //   type: function () {},
    //   proxy: function () {}
    // };
    // fetchStub = sinon.stub(request, 'post').returns(stubRequest);
    // endStub = sinon.stub(stubRequest, 'end').returns(stubRequest);
    // setStub = sinon.stub(stubRequest, 'set').returns(stubRequest);
    // typeStub = sinon.stub(stubRequest, 'type').returns(stubRequest);
    // sendStub = sinon.stub(stubRequest, 'send').returns(stubRequest);
    // proxyStub = sinon.stub(stubRequest, 'proxy').returns(stubRequest);
    fetchStub = sinon.spy(fetch.interface, 'fetch');
  });

  afterEach(function () {
    fetchStub.restore();
  });

  it('returns a promise', function () {
    assert.instanceOf(
      uploadRequest('path', {}, 'user', 'content', 'atoken'),
      Promise
    );
  });

  it('posts to the correct url', function () {
    uploadRequest('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken');
    assert(fetchStub.calledOnce);
    assert.equal('https://content.dropboxapi.com/2/files/upload', fetchStub.firstCall.args[0]);
  });

  it('sets the request type to application/octet-stream', function () {
    uploadRequest('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.headers['Content-Type'], 'application/octet-stream');
  });

  it('sets the authorization header', function () {
    uploadRequest('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.headers.Authorization, 'Bearer atoken');
  });

  it('sets the authorization and select user headers if selectUser set', function () {
    uploadRequest('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken', 'selectedUserId');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.headers.Authorization, 'Bearer atoken');
    assert.equal(options.headers['Dropbox-API-Select-User'], 'selectedUserId');
  });

  it('sets the Dropbox-API-Arg header', function () {
    uploadRequest('files/upload', { foo: 'bar' }, 'user', 'content', 'atoken');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.headers['Dropbox-API-Arg'], JSON.stringify({ foo: 'bar' }));
  });

  it('escapes special characters in the Dropbox-API-Arg header', function () {
    uploadRequest('files/upload', { foo: 'bar单bazá' }, 'user', 'content', 'atoken');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.headers['Dropbox-API-Arg'], '{"foo":"bar\\u5355baz\\u00e1"}');
  });

  it('doesn\'t include args.contents in the Dropbox-API-Arg header', function () {
    uploadRequest('files/upload', { foo: 'bar', contents: 'fakecontents' }, 'user', 'content', 'atoken');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.headers['Dropbox-API-Arg'], JSON.stringify({ foo: 'bar' }));
  });

  it('sends the contents arg as the body of the request', function () {
    uploadRequest('files/upload', { foo: 'bar', contents: 'fakecontents' }, 'user', 'content', 'atoken');
    var options = fetchStub.firstCall.args[1];
    assert.equal(options.body, 'fakecontents');
    assert.equal(options.headers['Dropbox-API-Arg'], JSON.stringify({ foo: 'bar' }));
  });
});

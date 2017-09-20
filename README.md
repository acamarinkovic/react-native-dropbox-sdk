# Dropbox JavaScript SDK for **React Native**

This project is a simple fork of the official [Dropbox SDK for JavaScript](https://github.com/dropbox/dropbox-sdk-js), made to work in React Native environments. Please see the original repository for documentation and all other resources.

## Installation

Simply install by running `npm install react-native-dropbox-sdk --save`.

## Changes

Below is a list of features where this project differs from the original:

 * `superagent` has been removed in favour of the native `fetch` command.
 * Proxies are no longer supported: download/upload requests have this parameter removed.
 * Returned error objects contain only `error` and `status` properties, not `response`.
 * Support for global `fetch` override by using `global.rnFetch`.

## License

All licenses and rights belong to Dropbox - by using this project you are inherently using their licensed work. Please refer to their original repository for more information. I take no ownership of any work provided here.

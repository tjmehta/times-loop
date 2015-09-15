'use strict';

var assign = require('101/assign');
var exists = require('101/exists');
var isNumber = require('101/is-number');
var isObject = require('101/is-object');
var syncTimes = require('./lib/sync.js');
var asyncTimes = require('./lib/async.js');

module.exports = timesWrapper;

/**
 * Depending on arguments passed it will act as `times` or return a `times` partial function
 * If the number of args is 1 or less it will return a times partial function
 * If the number of args is 2 it will pass the args to `sync-times` and return the results
 * If the number of args is 3 or more it will pass the args to `async-times` and return the results
 * @param {object} opts options or n
 * @param {function} [iteratee] function to be called n times
 * @param {function} [cb] function to be called after async times has finished
 * @return {times|results} times partial or times results
 */
function timesWrapper (opts) {
  var timesFn;
  if (arguments.length <= 1) {
    return timesPartial(opts || {});
  }
  else if (arguments.length === 2) {
    return syncTimes.apply(null, arguments);
  }
  else { // asyncTimes
    return asyncTimes.apply(null, arguments);
  }
}

function timesPartial (opts) {
  if (!isObject(opts)) {
    throw new Error('opts must be an object');
  }
  return function (opts2) {
    var args = Array.prototype.slice.call(arguments);
    if (isNumber(opts2)) {
      opts2 = { n: opts2 };
    }
    else if (!isObject(opts2)) {
      throw new Error('n must be a number or object');
    }
    args[0] = assign({}, opts, opts2);
    return timesWrapper.apply(null, args);
  };
}
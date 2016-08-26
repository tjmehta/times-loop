'use strict'
var defaults = require('101/defaults')
var isFunction = require('101/is-function')
var isNumber = require('101/is-number')
var isObject = require('101/is-object')
var isPromise = require('is-promise')

var promiseTimes = require('./promise-times.js')

module.exports = syncTimes

function syncTimes (opts, iteratee) {
  var ret = []
  if (!isObject(opts)) {
    opts = { n: opts }
  }
  if (!isNumber(opts.n)) {
    throw new Error('n must be a number')
  }
  // default indexArg to true
  defaults(opts, {
    indexArg: true
  })
  if (!isFunction(iteratee)) {
    throw new Error('iteratee must be a function')
  }
  var n = opts.n
  for (var i = 0; i < n; i++) {
    ret[i] = (opts.indexArg)
      ? iteratee(i)
      : iteratee()
    if (i === 0 && isPromise(ret[i])) {
      return promiseTimes(opts, iteratee, ret[0])
    }
  }
  return ret
}

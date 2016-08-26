'use strict'
var exists = require('101/exists')
var isFunction = require('101/is-function')
var isNumber = require('101/is-number')
var isObject = require('101/is-object')

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
  opts.indexArg = exists(opts.indexArg) ? opts.indexArg : true
  if (!isFunction(iteratee)) {
    throw new Error('iteratee must be a function')
  }
  var n = opts.n
  for (var i = 0; i < n; i++) {
    ret[i] = (opts.indexArg)
      ? iteratee(i)
      : iteratee()
  }
  return ret
}

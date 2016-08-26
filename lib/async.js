'use strict'
var createCount = require('callback-count')
var exists = require('101/exists')
var isObject = require('101/is-object')
var isNumber = require('101/is-number')
var isFunction = require('101/is-function')
var noop = require('101/noop')

module.exports = asyncTimes

function asyncTimes (opts, iteratee, cb) {
  var nextTick = process.nextTick || setTimeout
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
  cb = cb || noop
  var n = opts.n
  if (n <= 0) {
    return done()
  }
  var next = createCount(n, done).next
  for (var i = 0; i < n; i++) {
    step(i)
  }
  function step (i) {
    var icb = function icb (err, val) {
      ret[i] = err || val
      next(err)
    }
    var args = (opts.indexArg) ? [i, icb] : [icb]
    iteratee.apply(null, args)
  }
  function done (err) {
    // ensure async by using nextTick
    nextTick(function () {
      cb(err, ret)
    })
  }
}

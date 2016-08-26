'use strict'

module.exports = promiseTimes

function promiseTimes (opts, iteratee, first) {
  var ret = []
  // args are typechecked in sync.js
  var n = opts.n
  var promise = first
  for (var i = 1; i < n; i++) {
    (function (i) { // closure for i
      promise = promise.then(function (val) {
        ret[i - 1] = val
        return (opts.indexArg)
          ? iteratee(i)
          : iteratee()
      })
    })(i)
  }
  return promise.then(function (val) {
    ret[n - 1] = val
    return ret
  })
}

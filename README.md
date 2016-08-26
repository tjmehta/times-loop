# times-loop [![Build Status](https://travis-ci.org/tjmehta/times-loop.svg?branch=master)](https://travis-ci.org/tjmehta/times-loop) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
run a function n times, both sync and async functions are supported

### Usage

#### Syncronous loop
```js
// sync usage
var times = require('times-loop')

var ret = times(6, function (i) {
  console.log(i)
  return i
})
// prints: 0 1 2 3 4 5

console.log(ret)
// prints: [0, 1, 2, 3, 4, 5]
```

#### Asyncronous promise loop
If the first result is a promise, `times-loop` will _resolve_ the rest of the results in series.
In this case, it will return a promise that resolves all the results.

Note: if the first result is NOT an promise and subsequent results are, they will not be resolved.
```js
// sync usage
var times = require('times-loop')

times(6, function (i) {
  return Promise.resolve(i)
}).then(function (results) {
  console.log(results)
})
// prints: [0, 1, 2, 3, 4, 5]

// or even if just the *first* result is a promise
times(6, function (i) {
  return (i === 0)
    ? Promise.resolve(i)
    : i
}).then(function (results) {
  console.log(results)
})
// prints: [0, 1, 2, 3, 4, 5]

// Note: If first result is not a promise, results will NOT be resolved:
var ret = times(6, function (i) {
  return (i === 0)
    ? i
    : Promise.resolve(i)
})
console.log(ret)
// prints: [0, Promise { 1 }, Promise { 2 }, Promise { 3 }, Promise { 4 }, Promise { 5 }]
```

#### Asyncronous loop
```js
// async usage
var times = require('times-loop')

times(6,
  function (i, cb) {
    setTimeout(function () {
      cb(null, i)
    }, 100)
  },
  function (err, results) {
    console.log(results)
  })

// results: [ 0, 1, 2, 3, 4, 5 ]

// error case:
times(6,
  function (i, cb) {
    console.log(i)
    setTimeout(function () {
      cb(new Error())
    }, 100)
  },
  function (err, results) {
    console.log(err)
  })

  // prints: 0 [Error] 1 2 3 4 5 6
  // iteratee functions are still run n times
  // but final callback is only called once with the error
```

#### Options
```js
var times = require('times')({ indexArg: false })
times(6, function () {
  // i is not passed to this function
})

times(6,
  function (cb) {
    // i is not passed to this function
    cb()
  },
  function (err, results) {
    // ...
  })
```

### License
MIT

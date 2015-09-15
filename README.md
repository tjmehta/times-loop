# times-loop [![Build Status](https://travis-ci.org/tjmehta/times-loop.svg?branch=master)](https://travis-ci.org/tjmehta/times-loop)
run a function n times, both sync and async functions are supported

### Usage

#### Syncronous loop
```js
// sync usage
var times = require('times-loop');

times(6, function (i) {
  console.log(i);
});

// prints: 0 1 2 3 4 5
```

#### Asyncronous loop
```js
// async usage
var times = require('times-loop');

times(6,
  function (i, cb) {
    setTimeout(function () {
      cb(null, i);
    }, 100);
  },
  function (err, results) {
    console.log(results);
  });

// results: [ 0, 1, 2, 3, 4, 5 ]

// error case:
times(6,
  function (i, cb) {
    console.log(i);
    setTimeout(function () {
      cb(new Error());
    }, 100);
  },
  function (err, results) {
    console.log(err);
  });

  // prints: 0 [Error] 1 2 3 4 5 6
  // iteratee functions are still run n times
  // but final callback is only called once with the error
```

#### Options
```js
var times = require('times')({ indexArg: false });
times(6, function () {
  // i is not passed to this function
});

times(6,
  function (cb) {
    // i is not passed to this function
    cb();
  },
  function (err, results) {
    // ...
  });
```

### License
MIT

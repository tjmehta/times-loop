# times-loop [![Build Status](https://travis-ci.org/tjmehta/times-loop.svg?branch=master)](https://travis-ci.org/tjmehta/times-loop)

run a function n times, returns results as an array

# Usage

#### Supports both ESM and CommonJS

```js
// esm
import times from 'times-loop`
// commonjs
const times = require('times-loop').default
```

#### Simple Example

```js
import times from 'times-loop'

var results = times(6, function (i) {
  console.log(i)
  return i
})
// prints: 0 1 2 3 4 5

console.log(results)
// prints: [0, 1, 2, 3, 4, 5]
```

#### Promise Example: Parallel

runs callbacks in parallel and returns a promise that resolves all promise results as an array

```js
import { timesParallel } from 'times-loop'

const results = await timesParallel(6, function (i) {
  return Promise.resolve(i)
})

console.log(results)
// prints: [0, 1, 2, 3, 4, 5]
```

#### Promise Example: Series

runs callbacks in series (waits for each promise to resolve in series) and returns a promise that resolves all promise results as an array

```js
import { timesSeries } from 'times-loop'

const results = await timesSeries(6, function (i) {
  return Promise.resolve(i)
})

console.log(results)
// prints: [0, 1, 2, 3, 4, 5]
```

### License

MIT

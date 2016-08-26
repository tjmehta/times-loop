[2.0.0]
* breaking: Promise support. Sync now returns a promise if the first result is a promise.
  it runs the promises/results in series.

[1.0.0]
* Initial implementation w/ docs and 100% test coverage
* Supports sync loops
* Supports async loops
* Supports options: n, indexArg
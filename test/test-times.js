'use strict'

require('es6-promise').polyfill()

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var expect = require('code').expect
var sinon = require('sinon')
var noop = require('101/noop')
var times = require('../')

describe('times', function () {
  describe('sync', function () {
    it('should call a function n times', function (done) {
      for (var n = 0; n < 3; n++) {
        var spy = sinon.stub().returnsArg(0)
        var ret = times(n, spy)
        // assertions
        sinon.assert.callCount(spy, n)
        var expectedRet = []
        for (var i = 0; i < n; i++) {
          expect(spy.args[i]).to.deep.equal([i])
          expectedRet.push(i)
        }
        expect(ret).to.deep.equal(expectedRet)
      }
      done()
    })

    it('should call a function n times ( times created by factory)', function (done) {
      for (var n = 0; n < 3; n++) {
        var spy = sinon.stub().returnsArg(0)
        var t = times()
        var ret = t(n, spy)
        // assertions
        sinon.assert.callCount(spy, n)
        var expectedRet = []
        for (var i = 0; i < n; i++) {
          expect(spy.args[i]).to.deep.equal([i])
          expectedRet.push(i)
        }
        expect(ret).to.deep.equal(expectedRet)
      }
      done()
    })

    describe('opts', function () {
      it('should call a function n times w/out indexArg', function (done) {
        for (var n = 0; n < 3; n++) {
          var spy = sinon.stub().returns('val')
          var t = times({ indexArg: false })
          var ret = t({ n: n }, spy)
          // assertions
          sinon.assert.callCount(spy, n)
          var expectedRet = []
          for (var i = 0; i < n; i++) {
            expect(spy.args[i]).to.deep.equal([])
            expectedRet.push('val')
          }
          expect(ret).to.deep.equal(expectedRet)
        }
        done()
      })
    })

    describe('promises', function () {
      it('should run promises in series, if first result is a promise', function (done) {
        times(3, function (i) {
          return Promise.resolve(i)
        }).then(function (ret) {
          expect(ret).to.deep.equal([0, 1, 2])
          done()
        }).catch(done)
      })

      it('should just return promises, if first result is not a promise', function (done) {
        var ret = times(3, function (i) {
          if (i === 0) {
            return i
          }
          return Promise.resolve(i)
        })
        expect(ret[0]).to.equal(0)
        return ret[1].then(function (i) {
          expect(i).to.equal(1)
          return ret[2]
        }).then(function (i) {
          expect(i).to.equal(2)
          expect(ret.length).to.equal(3)
          done()
        }).catch(done)
      })

      describe('opts', function () {
        it('should run promises in series without i, if first result is a promise', function (done) {
          times({ n: 3, indexArg: false }, function (i) {
            return Promise.resolve(i)
          }).then(function (ret) {
            expect(ret).to.deep.equal([undefined, undefined, undefined])
            done()
          }).catch(done)
        })
      })
    })
  })

  describe('async', function () {
    it('should call a function n times', function (done) {
      var n = 3
      var spy = sinon.stub().yieldsAsync(null, 'val')
      times(n, spy, function (err, ret) {
        if (err) { return done(err) }
        // assertions
        sinon.assert.callCount(spy, n)
        var expectedRet = []
        for (var i = 0; i < n; i++) {
          expect(spy.args[i][0]).to.deep.equal([i][0])
          expect(spy.args[i][1]).to.be.a.function()
          expectedRet.push('val')
        }
        expect(ret).to.deep.equal(expectedRet)
        done()
      })
    })

    it('should call a function n times ( times created by factory)', function (done) {
      var n = 3
      var spy = sinon.stub().yieldsAsync(null, 'val')
      var t = times()
      t(n, spy, function (err, ret) {
        if (err) { return done(err) }
        // assertions
        sinon.assert.callCount(spy, n)
        var expectedRet = []
        for (var i = 0; i < n; i++) {
          expect(spy.args[i][0]).to.deep.equal([i][0])
          expect(spy.args[i][1]).to.be.a.function()
          expectedRet.push('val')
        }
        expect(ret).to.deep.equal(expectedRet)
        done()
      })
    })

    it('should not require final callback', function (done) {
      var n = 3
      var spy = sinon.stub().yieldsAsync(null, 'val')
      var t = times()
      t(n, spy, null)
      setTimeout(function () {
        for (var i = 0; i < n; i++) {
          expect(spy.args[i][0]).to.deep.equal([i][0])
          expect(spy.args[i][1]).to.be.a.function()
        }
        done()
      }, 50)
    })

    describe('opts', function () {
      it('should call a function n times w/out indexArg', function (done) {
        var n = 4
        var spy = sinon.stub().yieldsAsync(null, 'val')
        var t = times({ indexArg: false })
        t({ n: n }, spy, function (err, ret) {
          if (err) { return done(err) }
          // assertions
          sinon.assert.callCount(spy, n)
          var expectedRet = []
          for (var i = 0; i < n; i++) {
            expect(spy.args[i][0]).to.be.a.function()
            expectedRet.push('val')
          }
          expect(ret).to.deep.equal(expectedRet)
          done()
        })
      })
    })
  })

  describe('errors', function () {
    it('should error if opts2 is not an object or number', function (done) {
      expect(
        times.bind(null, noop)
      ).to.throw(/must be an object/)
      done()
    })

    it('should error if opts is not an object', function (done) {
      var t = times({ indexArg: false })
      expect(
        t.bind(null, noop, noop, noop)
      ).to.throw(/must be a number or object/)
      done()
    })

    it('should error if opts does not have n', function (done) {
      expect(
        times.bind(null, {}, noop)
      ).to.throw(/n must be a number/)
      expect(
        times.bind(null, {}, noop, noop)
      ).to.throw(/n must be a number/)
      done()
    })

    it('should error if iteratee not a function', function (done) {
      expect(
        times.bind(null, 9, 'iteratee')
      ).to.throw(/iteratee must be a function/)
      expect(
        times.bind(null, 9, 'iteratee', noop)
      ).to.throw(/iteratee must be a function/)
      done()
    })

    it('async should yield the error', function (done) {
      var boom = new Error('boom')
      times(1,
        function (i, cb) {
          cb(boom)
        },
        function (err) {
          expect(err).to.equal(boom)
          done()
        })
    })
  })

  describe('n === 0', function () {
    it('sync should basically do nothing and return []', function (done) {
      var n = 0
      var spy = sinon.stub().yieldsAsync(null, 'val')
      var ret = times(n, spy)
      expect(ret).to.deep.equal([])
      sinon.assert.callCount(spy, 0)
      done()
    })
    describe('no nextTick', function () {
      var nextTick = process.nextTick

      it('async should basically do nothing and yield []', function (done) {
        var n = 0
        var spy = sinon.stub().yieldsAsync(null, 'val')
        delete process.nextTick
        times(n, spy, function (err, ret) {
          if (err) { return done(err) }
          expect(ret).to.deep.equal([])
          sinon.assert.callCount(spy, 0)
          process.nextTick = nextTick
          done()
        })
      })
    })
  })
})

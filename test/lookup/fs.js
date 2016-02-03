'use strict'
var code = require('code')
var lab = exports.lab = require('lab').script()
var test = lab.test
var fs = require('../../lookup/fs')
var path = require('path')
var expect = code.expect
var folder = path.join(__dirname, 'fs')

test('custom strategy', function (done) {
  var strategy = {}
  var lookup = fs('', strategy)

  expect(lookup.strategy).to.equal(strategy)
  done()
})

test('missing file lookup', function (done) {
  expect(fs(folder).get('de.b')).to.equal(undefined)
  done()
})

test('undefined subkey', function (done) {
  var lookup = fs('')

  expect(lookup.get('en')).to.equal(undefined)
  done()
})

test('same file more than once', function (done) {
  var lookup = fs(folder)

  expect(lookup.get('en.b')).to.equal('c')
  expect(lookup.get('en.d')).to.equal('e')
  done()
})

test('empty file', function (done) {
  var lookup = fs(folder)

  expect(lookup.get('ja.d')).to.equal(undefined)
  done()
})

test('load strategy returns null', function (done) {
  var strategy = require('../../lookup/folder/json')
  var lookup = fs(folder, strategy)

  strategy.load = function () { return null }

  expect(lookup.get('en.d')).to.equal(undefined)
  done()
})

test('load a problematic string', function (done) {
  var strategy = require('../../lookup/folder/json')
  var lookup = fs(folder, strategy)
  var problemString = '.\n'

  strategy.load = function () { return null }

  expect(lookup.get(problemString)).to.equal(undefined)
  done()
})

lab.experiment('fs errors', function () {
  var mockery = require('mockery')
  var existsMock = {
    existsSync: function () {
      throw new Error('fun!')
    }
  }
  var allowables = ['../../lookup/fs', './folder/json.js']
  var readMock = {
    existsSync: function () { return true },
    readFileSync: function () {
      throw new Error('fax')
    }
  }

  lab.before(function (done) {
    mockery.enable()
    mockery.registerAllowables(allowables)
    done()
  })

  test('fs exists error', function (done) {
    mockery.registerMock('fs', existsMock)
    var lookup = require('../../lookup/fs')(folder)
    expect(lookup.get('en')).to.equal(undefined)
    done()
  })

  test('fs readFile error', function (done) {
    mockery.registerMock('fs', readMock)
    var lookup = require('../../lookup/fs')(folder)
    expect(lookup.get('en')).to.equal(undefined)
    done()
  })

  lab.afterEach(function (done) {
    mockery.deregisterMock('fs')
    done()
  })

  lab.after(function (done) {
    mockery.disable()
    mockery.deregisterAllowables(allowables)
    done()
  })
})

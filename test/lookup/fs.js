'use strict'
var tap = require('tap')
var before = tap.before
var after = tap.after
var afterEach = tap.afterEach
var test = tap.test
var fsLookup = require('../../lookup/fs')
var path = require('path')
var jsonFolderLookup = require('../../lookup/folder/json')
var folder = path.join(__dirname, 'fs')

test('custom strategy', function (t) {
  var strategy = {}
  var lookup = fsLookup('', strategy)

  t.equals(lookup.strategy, strategy)
  t.end()
})

test('missing file lookup', function (t) {
  t.equals(fsLookup(folder).get('de.b'), undefined)
  t.end()
})

test('undefined subkey', function (t) {
  var lookup = fsLookup('')

  t.equals(lookup.get('en'), undefined)
  t.end()
})

test('same file more than once', function (t) {
  var lookup = fsLookup(folder)

  t.equals(lookup.get('en.b'), 'c')
  t.equals(lookup.get('en.d'), 'e')
  t.end()
})

test('empty file', function (t) {
  var lookup = fsLookup(folder)

  t.equals(lookup.get('ja.d'), undefined)
  t.end()
})

test('load strategy returns null', function (t) {
  var lookup = fsLookup(folder, jsonFolderLookup)

  jsonFolderLookup.load = function () { return null }

  t.equals(lookup.get('en.d'), undefined)
  t.end()
})

test('load a problematic string', function (t) {
  var lookup = fsLookup(folder, jsonFolderLookup)
  var problemString = '.\n'

  jsonFolderLookup.load = function () { return null }

  t.equals(lookup.get(problemString), undefined)
  t.end()
})

test('fs errors', function () {
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

  before(function (t) {
    mockery.enable()
    mockery.registerAllowables(allowables)
    t.end()
  })

  test('fs exists error', function (t) {
    mockery.registerMock('fs', existsMock)
    var lookup = require('../../lookup/fs')(folder)
    t.equals(lookup.get('en'), undefined)
    t.end()
  })

  test('fs readFile error', function (t) {
    mockery.registerMock('fs', readMock)
    var lookup = require('../../lookup/fs')(folder)
    t.equals(lookup.get('en'), undefined)
    t.end()
  })

  afterEach(function (t) {
    mockery.deregisterMock('fs')
    t.end()
  })

  after(function (t) {
    mockery.disable()
    mockery.deregisterAllowables(allowables)
    t.end()
  })
})

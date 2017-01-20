'use strict'
var tap = require('tap')
var afterEach = tap.afterEach
var test = tap.test
var fs = require('fs')
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
  var hiddenFile = path.join(folder, 'hidden.json')
  var originalMode = fs.statSync(hiddenFile).mode
  try {
    fs.chmodSync(hiddenFile, 64)
    t.equals(lookup.get('hidden.d'), undefined)
  } catch (e) {
    console.log(e)
    fs.chmodSync(hiddenFile, originalMode)
    throw e
  }
  fs.chmodSync(hiddenFile, originalMode)
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

var mockery = require('mockery')
var allowables = ['../../lookup/fs', './folder/json.js']

mockery.enable()
mockery.registerAllowables(allowables)

afterEach(function (cb) {
  mockery.deregisterMock('fs')
  cb()
})

test('fs exists error', function (t) {
  var existsMock = {
    existsSync: function () {
      throw new Error('fun!')
    }
  }
  mockery.registerMock('fs', existsMock)
  var lookup = require('../../lookup/fs')(folder)
  t.equals(lookup.get('en'), undefined)
  t.end()
})

test('fs readFile error', function (t) {
  var readMock = {
    existsSync: function () { return true },
    readFileSync: function () {
      throw new Error('fax')
    }
  }
  mockery.registerMock('fs', readMock)
  var lookup = require('../../lookup/fs')(folder)
  t.equals(lookup.get('en'), undefined)
  t.end()
})

mockery.disable()
mockery.deregisterAllowables(allowables)

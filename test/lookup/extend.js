'use strict'
var test = require('tap').test
var extend = require('../../lookup/extend')
var i18n = require('../../')

test('extend i18n', function (t) {
  var extended = extend(i18n({
    'a': 'b'
  }), { get: function () {
    return 'c'
  }})
  t.equals(extended.get('a'), 'b')
  t.equals(extended.get('b'), 'c')
  t.end()
})

test('extend i18n without lookup', function (t) {
  var extended = extend(i18n({
    'a': 'b'
  }))
  t.equals(extended.get('a'), 'b')
  t.equals(extended.get('b'), undefined)
  t.end()
})

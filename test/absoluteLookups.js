'use strict'
var test = require('tap').test
var i18n = require('../')

test('absolute on root should work like a regular call', function (t) {
  var root = i18n({a: {b: 'c'}})
  t.equals(root('a.b'), 'c')
  t.equals(root.getAbs('a.b'), 'c')
  t.end()
})

test('absolute on a prefixed API should resolve to the parent', function (t) {
  var root = i18n({a: {b: 'c'}})
  var prefixed = root.prefix('a.')
  t.equals(prefixed('b'), 'c')
  t.equals(prefixed.getAbs('a.b'), 'c')
  t.end()
})

test('absolute on a locked, prefixed API should resolve to the child', function (t) {
  var root = i18n({a: {b: 'c'}})
  var prefixed = root.prefix('a.').lock()
  t.equals(prefixed('b'), 'c')
  t.equals(prefixed.getAbs('a.b'), undefined)
  t.end()
})

test('unlocking shouldnt create a new node', function (t) {
  var root = i18n({a: {b: 'c'}})
  var prefixed = root.prefix('a.')
  var newPrefixed = prefixed.lock(false)
  t.equals(prefixed, newPrefixed)
  t.end()
})

test('unlocking of a locked, prefixed API', function (t) {
  var root = i18n({a: {b: 'c'}})
  var prefixed = root.prefix('a.').lock().lock(false)
  t.equals(prefixed('b'), 'c')
  t.equals(prefixed.getAbs('a.b'), 'c')
  t.end()
})

test('t _ absolute on root should work like a regular call', function (t) {
  var root = i18n({a: {b: 'x%s'}})
  t.equals(root('a.b', 'c'), 'xc')
  t.equals(root.abs('a.b', 'c'), 'xc')
  t.end()
})

test('t _ absolute on a prefixed API should resolve to the parent', function (t) {
  var root = i18n({a: {b: 'x%s'}})
  var prefixed = root.prefix('a.')
  t.equals(prefixed('b', 'c'), 'xc')
  t.equals(prefixed.abs('a.b', 'c'), 'xc')
  t.end()
})

test('t _ absolute on a locked, prefixed API should resolve to the child', function (t) {
  var root = i18n({a: {b: 'x%s'}})
  var prefixed = root.prefix('a.').lock()
  t.equals(prefixed('b', 'c'), 'xc')
  t.equals(prefixed.abs('a.b', 'c'), 'a.a.b')
  t.end()
})

test('t _ unlocking of a locked, prefixed API', function (t) {
  var root = i18n({a: {b: 'x%s'}})
  var prefixed = root.prefix('a.').lock().lock(false)
  t.equals(prefixed('b', 'c'), 'xc')
  t.equals(prefixed.abs('a.b', 'c'), 'xc')
  t.end()
})

test('t _ abs with an object', function (t) {
  var root = i18n({a: {b: 'x{{x}}'}})
  var prefixed = root.prefix('a.').lock().lock(false)
  t.equals(prefixed.abs('a.b', {x: 'c'}), 'xc')
  t.end()
})

test('translate _ abs with an object', function (t) {
  var root = i18n({a: {b: 'x{{x}}'}})
  var prefixed = root.prefix('a.').lock().lock(false)
  t.equals(prefixed.translateAbs('a.b'), 'x{{x}}')
  t.end()
})

test('has _ absolute on root should work like a regular call', function (t) {
  var root = i18n({a: {b: 'c'}})
  t.equals(root.has('a.b'), true)
  t.equals(root.hasAbs('a.b'), true)
  t.end()
})

test('has _ absolute on a prefixed API should resolve to the parent', function (t) {
  var root = i18n({a: {b: 'c'}})
  var prefixed = root.prefix('a.')
  t.equals(prefixed.has('b'), true)
  t.equals(prefixed.hasAbs('a.b'), true)
  t.end()
})

test('has _ absolute on a locked prefixed should resolve to the child', function (t) {
  var root = i18n({a: {b: 'c'}})
  var prefixed = root.prefix('a.').lock()
  t.equals(prefixed.has('b'), true)
  t.equals(prefixed.hasAbs('a.b'), false)
  t.end()
})

test('has _ unlocking of a locked, prefixed API', function (t) {
  var root = i18n({a: {b: 'c'}})
  var prefixed = root.prefix('a.').lock().lock(false)
  t.equals(prefixed.has('b'), true)
  t.equals(prefixed.hasAbs('a.b'), true)
  t.end()
})

test('n _ unlocking of a locked, prefixed API', function (t) {
  var root = i18n({a: {b: 'c'}})
  var prefixed = root.prefix('hubba')
  t.equals(prefixed.absN('a.b', 'a.c', 1), 'c')
  t.end()
})

test('n _ unlocking of a locked, prefixed API with object', function (t) {
  var root = i18n({a: {b: '{{x}}'}})
  var prefixed = root.prefix('hubba')
  t.equals(prefixed.absN('a.b', undefined, {x: 'c'}, 1), 'c')
  t.end()
})

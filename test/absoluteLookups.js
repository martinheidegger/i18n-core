'use strict'
var test = require('tap').test
var i18n = require('../')

test('absolute on root should work like a regular call', function (t) {
  var root = i18n({a: {b: 'c'}})
  t.equals(root('a.b'), 'c')
  t.equals(root.getAbs('a.b'), 'c')
  t.end()
})

test('absolute on a sub should resolve to the parent', function (t) {
  var root = i18n({a: {b: 'c'}})
  var sub = root.sub('a.')
  t.equals(sub('b'), 'c')
  t.equals(sub.getAbs('a.b'), 'c')
  t.end()
})

test('absolute on a locked sub should resolve to the child', function (t) {
  var root = i18n({a: {b: 'c'}})
  var sub = root.sub('a.').lock()
  t.equals(sub('b'), 'c')
  t.equals(sub.getAbs('a.b'), undefined)
  t.end()
})

test('unlocking shouldnt create a new node', function (t) {
  var root = i18n({a: {b: 'c'}})
  var sub = root.sub('a.')
  var newSub = sub.lock(false)
  t.equals(sub, newSub)
  t.end()
})

test('unlocking of a locked sub', function (t) {
  var root = i18n({a: {b: 'c'}})
  var sub = root.sub('a.').lock().lock(false)
  t.equals(sub('b'), 'c')
  t.equals(sub.getAbs('a.b'), 'c')
  t.end()
})

test('t _ absolute on root should work like a regular call', function (t) {
  var root = i18n({a: {b: 'x%s'}})
  t.equals(root('a.b', 'c'), 'xc')
  t.equals(root.abs('a.b', 'c'), 'xc')
  t.end()
})

test('t _ absolute on a sub should resolve to the parent', function (t) {
  var root = i18n({a: {b: 'x%s'}})
  var sub = root.sub('a.')
  t.equals(sub('b', 'c'), 'xc')
  t.equals(sub.abs('a.b', 'c'), 'xc')
  t.end()
})

test('t _ absolute on a locked sub should resolve to the child', function (t) {
  var root = i18n({a: {b: 'x%s'}})
  var sub = root.sub('a.').lock()
  t.equals(sub('b', 'c'), 'xc')
  t.equals(sub.abs('a.b', 'c'), 'a.a.b')
  t.end()
})

test('t _ unlocking of a locked sub', function (t) {
  var root = i18n({a: {b: 'x%s'}})
  var sub = root.sub('a.').lock().lock(false)
  t.equals(sub('b', 'c'), 'xc')
  t.equals(sub.abs('a.b', 'c'), 'xc')
  t.end()
})

test('t _ abs with an object', function (t) {
  var root = i18n({a: {b: 'x{{x}}'}})
  var sub = root.sub('a.').lock().lock(false)
  t.equals(sub.abs('a.b', {x: 'c'}), 'xc')
  t.end()
})

test('translate _ abs with an object', function (t) {
  var root = i18n({a: {b: 'x{{x}}'}})
  var sub = root.sub('a.').lock().lock(false)
  t.equals(sub.translateAbs('a.b'), 'x{{x}}')
  t.end()
})

test('has _ absolute on root should work like a regular call', function (t) {
  var root = i18n({a: {b: 'c'}})
  t.equals(root.has('a.b'), true)
  t.equals(root.hasAbs('a.b'), true)
  t.end()
})

test('has _ absolute on a sub should resolve to the parent', function (t) {
  var root = i18n({a: {b: 'c'}})
  var sub = root.sub('a.')
  t.equals(sub.has('b'), true)
  t.equals(sub.hasAbs('a.b'), true)
  t.end()
})

test('has _ absolute on a locked sub should resolve to the child', function (t) {
  var root = i18n({a: {b: 'c'}})
  var sub = root.sub('a.').lock()
  t.equals(sub.has('b'), true)
  t.equals(sub.hasAbs('a.b'), false)
  t.end()
})

test('has _ unlocking of a locked sub', function (t) {
  var root = i18n({a: {b: 'c'}})
  var sub = root.sub('a.').lock().lock(false)
  t.equals(sub.has('b'), true)
  t.equals(sub.hasAbs('a.b'), true)
  t.end()
})

test('n _ unlocking of a locked sub', function (t) {
  var root = i18n({a: {b: 'c'}})
  var sub = root.sub('hubba')
  t.equals(sub.absN('a.b', 'a.c', 1), 'c')
  t.end()
})

test('n _ unlocking of a locked sub with object', function (t) {
  var root = i18n({a: {b: '{{x}}'}})
  var sub = root.sub('hubba')
  t.equals(sub.absN('a.b', undefined, {x: 'c'}, 1), 'c')
  t.end()
})

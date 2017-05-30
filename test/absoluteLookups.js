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

test('a section of an absolute section should not loose the prefixes.', function (t) {
  var root = i18n({})
  var prefixed = root.absSection('a').section('b')
  t.equals(prefixed('c'), 'a.b.c')
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

test('using of an absolute prefix', function (t) {
  var root = i18n({a: {b: 1}, b: 2})
  var a1 = root.prefix('a.', true)
  t.equals(a1('b'), 1)
  var a2 = a1.absPrefix('')
  t.equals(a2('b'), 2)
  t.end()
})

test('using of an absolute prefix that can be modified', function (t) {
  var root = i18n({a: {b: 1}, b: 2})
  var prefixed = root.absPrefix('', true)
  t.equals(prefixed('b'), 2)
  prefixed.changePrefix('a.')
  t.equals(prefixed('b'), 1)
  t.end()
})

test('using of an absolute section', function (t) {
  var root = i18n({a: {b: {c: 1}}, b: {c: 2}})
  var a1 = root.prefix('a.b.', true)
  t.equals(a1('c'), 1)
  var a2 = a1.absSection('b')
  t.equals(a2('c'), 2)
  t.end()
})

test('root will result in the same lookup as absPrefix with ""', function (t) {
  var initial = i18n({a: {b: 1}, b: 2})
  var a1 = initial.prefix('a.')
  var a2 = a1.absPrefix('')
  var a3 = a1.root()
  t.equals(a2('b'), a3('b'))
  t.end()
})

test('an absolute prefix is required like a regular one', function (t) {
  var root = i18n({a: {b: 1}, b: 2})
  try {
    root.absPrefix(null)
  } catch (e) {
    t.end()
    return
  }
  t.fail('No error thrown.')
  t.end()
})

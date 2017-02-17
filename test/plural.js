'use strict'
var test = require('tap').test
var i18n = require('../')

test('plurals', function (t) {
  var translator = i18n().section('en')
  var __n = translator.__n
  t.equals(__n('%s a', '', 1), 'en.1 a')
  t.equals(__n('', '%s b', 2), 'en.2 b')
  t.equals(__n('%s a {{count}}', '', 1), 'en.1 a 1')
  t.equals(__n('', '%s b {{count}}', 2), 'en.2 b 2')
  t.equals(__n('', '{{count}} c', 3), 'en.3 c')
  t.equals(__n('', '{{count}} c', 3, null), 'en.3 c')
  t.end()
})

test('plurals mixed with args', function (t) {
  var translator = i18n().section('en')
  var __n = translator.__n
  t.equals(__n('%s a %s', '', 1, 'x'), 'en.1 a x')
  t.equals(__n('', '%s b %s', 2, 'y'), 'en.2 b y')
  t.equals(__n('%s c %s {{a}}', '', 1, {a: 'b'}, 'x'), 'en.1 c x b')
  t.equals(__n('', '%s d %s {{c}}', 2, {c: 'd'}, 'y'), 'en.2 d y d')
  t.equals(__n('', '%s e {{e}}', 2, {e: 'f'}), 'en.2 e f')
  t.end()
})

test('plural objects', function (t) {
  var translator = i18n().section('en')
  var __n = translator.__n
  t.equals(__n({one: 'a', other: '%s'}, 2, 'x'), 'en.2')
  t.equals(__n({1: 'b %s'}, 1, 'x'), 'en.b 1')
  t.equals(__n({one: 'b %s'}, 1, 'x'), 'en.b 1')
  t.equals(__n({2: 'c %s'}, 2, 'x'), 'en.c 2')
  t.equals(__n({}, {2: 'd %s'}, 2, 'x'), 'en.d 2')
  t.equals(__n({}, {other: 'e %s'}, 2, 'x'), 'en.e 2')
  t.equals(__n({other: 'e %s'}, {}, 2, 'x'), 'en.e 2')
  t.equals(__n({one: 'e %s'}, {}, 2, 'x'), 'en.')
  t.equals(__n({2: 'e %s'}, {}, 2, 'x'), 'en.e 2')
  t.end()
})

test('plural fallbacks', function (t) {
  var translator = i18n().section('en')
  var __n = translator.__n
  t.equals(__n('a %s', 2, 'x'), 'en.a 2')
  t.equals(__n({other: 'b %s'}, 2, 'x'), 'en.b 2')
  t.equals(__n({one: 'c %s'}, 2, 'x'), 'en.')
  t.equals(__n({other: 'd %s'}, null, 2, 'x'), 'en.d 2')
  t.equals(__n({2: 'e %s'}, null, 2, 'x'), 'en.e 2')
  t.equals(__n({one: 'f %s'}, null, 2, 'x'), 'en.')
  t.equals(__n('g %s', null, 2, 'x'), 'en.g 2')
  t.end()
})

test('plural special fallbacks', function (t) {
  var translator = i18n({a: 'b', c: {one: 'd', other: 'e'}})
  var __n = translator.__n
  t.equals(__n('a', 2), 'b')
  t.equals(__n('c', 2), 'e')
  t.equals(__n('g', {other: 'f'}, 2), 'f')
  t.end()
})

test('singular fallback to count', function (t) {
  var translator = i18n({a: 'b', c: {one: 'd', other: 'e'}})
  var __n = translator.__n
  t.equals(__n({
    2: 'ho'
  }, {}, 2), 'ho')
  t.end()
})

test('empty plurals', function (t) {
  var translator = i18n({a: 'b', c: {one: 'd', other: 'e'}})
  var __n = translator.__n
  t.equals(__n(null, 2), '(?)')
  t.equals(__n(null, 1), '(?)')
  t.end()
})

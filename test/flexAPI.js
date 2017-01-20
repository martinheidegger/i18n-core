'use strict'
var test = require('tap').test
var i18n = require('../')

test('Using __ on __', function (t) {
  var __ = i18n({a: 'b'}).__
  t.equals(__.__('a'), 'b')
  t.end()
})

test('Using __n on __', function (t) {
  var __ = i18n({a: 'b'}).__
  t.equals(__.__n('%s a', '', 1), '1 a')
  t.end()
})

test('Using raw on __', function (t) {
  var __ = i18n({a: '%s'}).__
  t.equals(__.raw('a'), '%s')
  t.end()
})

test('Using has on __', function (t) {
  var __ = i18n({a: '%s'}).__
  t.equals(__.has('b'), false)
  t.equals(__.has('a'), true)
  t.end()
})

test('Using sub on __', function (t) {
  var __ = i18n({x: {
    'a': 'b'
  }}).__
  t.equals(__.sub('x.').__('a'), 'b')
  t.end()
})

test('Using changeLang on __', function (t) {
  var __ = i18n({
    en: {a: 'b'},
    de: {a: 'c'}
  }).lang('en', true).__
  __.changeLang('de')
  t.equals(__('a'), 'c')
  t.end()
})

test('Using lang on __', function (t) {
  var __ = i18n({
    en: {a: 'b'}
  })
  t.equals(__.lang('en').__('a'), 'b')
  t.end()
})

test('Using sub on __', function (t) {
  var __ = i18n({
    en: {a: 'b'}
  }).__
  t.equals(__.sub('en.').__('a'), 'b')
  t.end()
})

test('Using translate on __', function (t) {
  var __ = i18n({a: 'b'}).__
  t.equals(__.translate('a'), 'b')
  t.end()
})

test('Using translate on __', function (t) {
  var __ = i18n({a: 'b'}).__
  t.equals(__.translateFirst(['c', 'a']), 'b')
  t.end()
})

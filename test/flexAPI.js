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

test('Using get on __', function (t) {
  var __ = i18n({a: '%s'}).__
  t.equals(__.get('a'), '%s')
  t.end()
})

test('Using has on __', function (t) {
  var __ = i18n({a: '%s'}).__
  t.equals(__.has('b'), false)
  t.equals(__.has('a'), true)
  t.end()
})

test('Using section on __', function (t) {
  var __ = i18n({x: {
    'a': 'b'
  }}).__
  t.equals(__.prefix('x.').__('a'), 'b')
  t.end()
})

test('Using changeSection on __', function (t) {
  var __ = i18n({
    en: {a: 'b'},
    de: {a: 'c'}
  }).section('en', true).__
  __.changeSection('de')
  t.equals(__('a'), 'c')
  t.end()
})

test('Using section on __', function (t) {
  var __ = i18n({
    en: {a: 'b'}
  })
  t.equals(__.section('en').__('a'), 'b')
  t.end()
})

test('Using prefix on __', function (t) {
  var __ = i18n({
    en: {a: 'b'}
  }).__
  t.equals(__.prefix('en.').__('a'), 'b')
  t.end()
})

test('Using translate on __', function (t) {
  var __ = i18n({a: 'b'}).__
  t.equals(__.translate('a'), 'b')
  t.end()
})

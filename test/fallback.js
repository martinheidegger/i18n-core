'use strict'
var test = require('tap').test
var i18n = require('../')

test('fallback', function (t) {
  var translator = i18n()
  var __ = translator.__
  t.equals(__('a'), 'a')
  t.equals(__(''), '(?)')
  t.end()
})

test('custom root fallback', function (t) {
  var translator = i18n()
  translator.fallback = function () {
    return 'x'
  }
  translator = translator.section('en')
  t.equals(translator.__('a'), 'x')
  t.equals(translator.__(''), 'x')
  t.end()
})

test('fallback should show the absolute locks', function (t) {
  var __ = i18n().section('en').lock().absSection('b.a')
  t.equals(__('c'), 'en.b.a.c')
  t.end()
})

test('custom child fallback should not work!', function (t) {
  var translator = i18n().section('en')
  translator.fallback = function () {
    return 'x'
  }
  t.equals(translator.__('a'), 'en.a')
  t.end()
})

'use strict'
var test = require('tap').test
var render = require('../lib/mustacheSimple').render

test('Simple parameter replacement', function (t) {
  t.equals(render('hello {{x}}', {x: 'world'}), 'hello world')
  t.equals(render('hello {{x}}', {x: '<world>'}), 'hello &lt;world&gt;')
  t.end()
})

test('additional brace parameter replacement', function (t) {
  t.equals(render('hello {{{x}}}', {x: 'world'}), 'hello world')
  t.equals(render('hello {{{x}}}', {x: '<world>'}), 'hello <world>')
  t.end()
})

test('mutiple brace parameter replacement', function (t) {
  t.equals(render('hello {{x}}, {{y}}', {x: 'world', y: 'nice day'}), 'hello world, nice day')
  t.equals(render('hello {{x}}, {{y}} {{{z}}}', {x: 'world', y: 'nice day', z: 'huh?'}), 'hello world, nice day huh?')
  t.end()
})

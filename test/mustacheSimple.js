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

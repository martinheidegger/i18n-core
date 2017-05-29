'use strict'
var test = require('tap').test
var render = require('../lib/vsprintfSimple')

test('Simple argument replacement', function (t) {
  t.equals(render('hello %s', ['world']), 'hello world')
  t.end()
})

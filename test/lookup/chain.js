'use strict'
var test = require('tap').test
var chain = require('../../lookup/chain')

test('empty chain', function (t) {
  t.equals(chain().get('a'), undefined)
  t.equals(chain().get('b'), undefined)
  t.end()
})

test('chain with one element', function (t) {
  t.equals(chain({get: function () { return 'a' }}).get('b'), 'a')
  t.end()
})

test('chain with two elements', function (t) {
  var chained = chain(
    {get: function (x) { return x === 'a' ? 'b' : null }},
    {get: function (x) { return 'c' }}
  )
  t.equals(chained.get('a'), 'b')
  t.equals(chained.get('b'), 'c')
  t.end()
})

test('chain with two functions', function (t) {
  var chained = chain(
    function (x) { return x === 'a' ? 'b' : null },
    function (x) { return 'c' }
  )
  t.equals(chained.get('a'), 'b')
  t.equals(chained.get('b'), 'c')
  t.end()
})

test('chain with null element', function (t) {
  var chained = chain(
    {get: function (x) { return x === 'a' ? 'b' : null }},
    null,
    {get: function (x) { return 'c' }}
  )
  t.equals(chained.get('a'), 'b')
  t.equals(chained.get('b'), 'c')
  t.end()
})

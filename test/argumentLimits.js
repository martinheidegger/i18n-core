'use strict'
var test = require('tap').test
var i18n = require('../')

// console.log( fillWithNumbers(['$', 'a'], 3) )
// -> ['$', 'a', 1, 2, 3]
function fillWithNumbers (arr, max) {
  var offset = arr.length
  max += offset
  while (arr.length <= max) {
    arr.push(arr.length - offset + 1)
  }
  return arr
}

function times (amount, text) {
  var result = []
  for (var i = 0; i < amount; i++) {
    result.push(text)
  }
  return result
}

test('limiting sprintf to max 9 fields', function (t) {
  var placeholders = 13
  var allowed = 10
  var prefix = 1
  var __ = i18n({'$': (times(placeholders, '%s').join(' '))}).__
  var args = fillWithNumbers(['$'], placeholders)
  while (args.length > prefix + 1) {
    var cut = Math.min(allowed + prefix, args.length)
    var params = args.slice(prefix, cut)
      .concat(times(placeholders + prefix - cut, 'undefined'))
      .join(' ')
    t.equals(
      __.apply(null, args),
      params,
      JSON.stringify({
        type: 'regular',
        get: __.get('$'),
        allowed: allowed,
        prefix: prefix,
        params: params,
        placeholders: placeholders,
        cut: cut,
        'args.length': args.length
      }, null, true)
    )
    args.pop()
  }
  t.end()
})

test('limiting sprintf to max 9 fields with an object', function (t) {
  var placeholders = 13
  var allowed = 10
  var prefix = 2
  var objectPlaceHolder = 'b'
  var __ = i18n({'$': '{{a}}' + (new Array(placeholders + 1).join(' %s'))}).__
  var args = fillWithNumbers(['$', {a: objectPlaceHolder}], placeholders)
  while (args.length > prefix + 1) {
    var cut = Math.min(allowed + prefix, args.length)
    var params = [ objectPlaceHolder ]
      .concat(args.slice(prefix, cut))
      .concat(times(placeholders + prefix - cut, 'undefined'))
      .join(' ')
    t.equals(
      __.apply(null, args),
      params,
      JSON.stringify({
        args: args,
        type: 'with object',
        get: __.get('$'),
        allowed: allowed,
        prefix: prefix,
        params: params,
        placeholders: placeholders,
        cut: cut,
        'args.length': args.length
      }, null, true)
    )
    args.pop()
  }
  t.end()
})

test('limiting sprintf to max 9 fields', function (t) {
  var placeholders = 12
  var allowed = 10
  var prefix = 3
  var __ = i18n({'$': (times(placeholders, '%s').join(' '))})
  var __n = __.__n
  var args = fillWithNumbers(['$', null, 999], placeholders - 1)
  while (args.length > prefix + 1) {
    var cut = Math.min(allowed + prefix, args.length)
    var params = [ '999' ]
      .concat(args.slice(prefix, cut))
      .concat(times(placeholders + prefix - cut - 1, 'undefined'))
      .join(' ')
    t.equals(
      __n.apply(null, args),
      params,
      JSON.stringify({
        type: 'regular',
        get: __.get('$'),
        allowed: allowed,
        prefix: prefix,
        params: params,
        placeholders: placeholders,
        cut: cut,
        'args.length': args.length
      }, null, true)
    )
    args.pop()
  }
  t.end()
})

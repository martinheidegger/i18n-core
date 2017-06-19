'use strict'
var test = require('tap').test
var createNode = require('../lib/createNode')

function handler () {}
function handler2 () {}
function handler3 () {}

test('non-modifyable shouldnt track listeners', function (t) {
  var node = createNode('', {}, function () {}, false)
  node.on('contextChange', function () {})
  t.equals(node.listener, undefined)
  t.end()
})

test('modifyable should track listeners', function (t) {
  var node = createNode('', {}, function () {}, true)
  node.on('contextChange', handler)
  t.equals(node.listener, handler)
  t.end()
})

test('the same listener should not be added twice', function (t) {
  var node = createNode('', {}, function () {}, true)
  node.on('contextChange', handler)
  node.on('contextChange', handler)
  t.equals(node.listener, handler)
  t.end()
})

test('modifyable should track multiple listeners as linked list', function (t) {
  var node = createNode('', {}, function () {}, true)
  node.on('contextChange', handler)
  node.on('contextChange', handler2)
  t.deepEquals(node.listener, {
    fn: handler,
    next: {
      fn: handler2
    }
  })
  t.end()
})

test('Even with multiple listeners it shouldnt add the same listener twice', function (t) {
  var node = createNode('', {}, function () {}, true)
  node.on('contextChange', handler)
  node.on('contextChange', handler2)
  node.on('contextChange', handler2)
  t.deepEquals(node.listener, {
    fn: handler,
    next: {
      fn: handler2
    }
  })
  t.end()
})

test('removing a listener should work', function (t) {
  var node = createNode('', {}, function () {}, true)
  node.on('contextChange', handler)
  node.off('contextChange', handler)
  t.equals(node.listener, undefined)
  t.end()
})

test('removing the first listener of multiple listeners should work', function (t) {
  var node = createNode('', {}, function () {}, true)
  node.on('contextChange', handler)
  node.on('contextChange', handler2)
  node.off('contextChange', handler)
  t.equals(node.listener, handler2)
  t.end()
})

test('removing the second listener of multiple listeners should work', function (t) {
  var node = createNode('', {}, function () {}, true)
  node.on('contextChange', handler)
  node.on('contextChange', handler2)
  node.off('contextChange', handler2)
  t.equals(node.listener, handler)
  t.end()
})

test('listeners should be called once changed', function (t) {
  var node = createNode('', {}, function () {}, true)
  var called = false
  node.on('contextChange', function () {
    if (called) {
      t.fail('Called twice?')
    }
    called = true
  })
  node.changePrefix('x')
  t.ok(called)
  t.end()
})

test('multiple listeners should be called once changed', function (t) {
  var node = createNode('', {}, function () {}, true)
  var called = []
  node.on('contextChange', function () {
    called.push('a')
  })
  node.on('contextChange', function () {
    called.push('b')
  })
  node.on('contextChange', function () {
    called.push('c')
  })
  node.changePrefix('x')
  t.deepEquals(called, ['a', 'b', 'c'])
  t.end()
})

test('child listening should trigger a listener in the parent', function (t) {
  var node = createNode('', {}, function () {}, true)
  var child = node.prefix('fancy')
  child.on('contextChange', handler)
  t.notEquals(node.listener, undefined)
  t.notEquals(node.listener, handler)

  t.equals(child.listener, handler)
  child.off('contextChange', handler)
  t.equals(node.listener, undefined)
  t.equals(child.listener, undefined)
  t.end()
})

test('remove one of multiple listeners in a child', function (t) {
  var node = createNode('', {}, function () {}, true)
  var child = node.prefix('fancy')
  child.on('contextChange', handler)
  child.on('contextChange', handler2)
  child.on('contextChange', handler3)
  child.off('contextChange', handler)
  child.off('contextChange', handler2)
  child.off('contextChange', handler3)
  t.equals(node.listener, undefined)
  t.end()
})

test('ignoring events that arnt contextChange or functions', function (t) {
  var node = createNode('', {}, function () {}, true)
  node.on('change', handler)
  node.on('contextChange', null)
  t.equals(node.listener, undefined)
  t.end()
})

test('ignoring events that arnt contextChange or functions', function (t) {
  var node = createNode('', {}, function () {}, true)
  // Needs to test after an handler is added, else it uses noop
  node.on('contextChange', handler)
  node.off('contextChange', null)
  node.off('change', handler)
  t.equals(node.listener, handler)
  t.end()
})

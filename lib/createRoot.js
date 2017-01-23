'use strict'
var createNode = require('./createNode.js')

function createRoot (lookup, translateFn) {
  var rootNode = createNode('', lookup, translateFn, false)
  rootNode.absRoot = rootNode
  return rootNode
}

module.exports = createRoot

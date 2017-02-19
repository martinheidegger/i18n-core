'use strict'

var simple = require('./simple.js')

module.exports = function (data) {
  var rootAPI = simple(data)
  rootAPI.mustache = require('mustache')
  rootAPI.vsprintf = require('sprintf').vsprintf
  return rootAPI
}

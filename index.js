'use strict'

module.exports = function (data) {
  try {
    return require('./full')(data)
  } catch (e) {
    return require('./simple')(data)
  }
}

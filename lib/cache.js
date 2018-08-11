'use strict'

const LRU = require('lru-cache')
const ms = require('ms')

module.exports = new LRU({
  max: 100,
  maxAge: ms('1h')
})

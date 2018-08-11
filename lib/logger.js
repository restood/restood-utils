'use strict'

const bole = require('bole')
const chalk = require('chalk')
const rfs = require('rotating-file-stream')
const through = require('through2')

const levels = {
  info: chalk.green,
  error: chalk.red,
  warn: chalk.yellow,
  debug: chalk.magenta
}

const rotator = rfs('logs.log', {
  path: 'logs',
  size: '10M',
  interval: '1d',
  compress: 'gzip'
})

const formatter = through((chunk, _, callback) => {
  try {
    let { id, level, name, message } = JSON.parse(chunk)

    const color = levels[level]

    id = id ? ` ${chalk.blue(id)} ` : ' '
    message = typeof message === 'object' ? JSON.stringify(message, null, 2) : message

    console.log(`${color(level)}${id}(${chalk.cyan(name)}) ${message}`)
    callback(null, chunk)
  } catch (e) {
    callback(e)
  }
})

bole.output({
  level: process.env.DEBUG ? 'debug' : 'info',
  stream: process.env.NODE_ENV === 'production' ? rotator : formatter
})

module.exports = function getLogger (name) {
  return bole(name)
}

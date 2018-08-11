'use strict'

const getLogger = require('./logger')

const logger = getLogger('terminate')

module.exports = function terminate (code, reason, callback) {
  return (err, p) => {
    let params = { code, reason }

    if (err) {
      params.error = err
      params.message = err.message
      params.stack = err.stack
    }

    if (p) {
      params.promise = p
    }

    if (code === 0) {
      logger.info({ message: params })
      process.exit(code)
    }

    logger.error({ message: params })

    setTimeout(_ => { process.exit(code) }, 500).unref()
  }
}

const clone = require('lodash/clone')
const merge = require('lodash/merge')

function middleware (properties, req, res, next) {
  if (!req.json) {
    return next()
  }

  req.json = merge(clone(properties), req.json)

  next()
}

function factory (properties) {
  return middleware.bind(null, properties)
}

module.exports = factory

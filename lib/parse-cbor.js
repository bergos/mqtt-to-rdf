const cbor = require('borc')

function middleware (req, res, next) {
  if (req.json) {
    return next()
  }

  try {
    req.json = cbor.decode(req.payload)
  } catch (err) {}

  next()
}

module.exports = middleware

function middleware (options, req, res, next) {
  if (!options) {
    return next()
  }

  if (options.map) {
    if (req.topic in options.map) {
      req.topic = options.map[req.topic]
    }
  }

  next()
}

function factory (options) {
  return middleware.bind(null, options)
}

module.exports = factory

function middleware (req, res, next) {
  if (req.json) {
    return next()
  }

  try {
    req.json = JSON.parse(req.payload.toString())
  } catch (err) {}

  next()
}

module.exports = middleware

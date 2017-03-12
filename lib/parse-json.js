'use strict'

function middleware (req, res, next) {
  try {
    req.json = JSON.parse(req.payload.toString())
  } catch (err) {}

  next()
}

module.exports = middleware

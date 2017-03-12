'use strict'

const JsonldParser = require('rdf-parser-jsonld')

function middleware (req, res, next) {
  if (!req.json) {
    return next()
  }

  JsonldParser.parse(req.json).then((graph) => {
    req.graph = graph
  }).then(next).catch(next)
}

module.exports = middleware

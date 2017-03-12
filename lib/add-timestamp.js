'use strict'

const cronify = require('rdf-cronify')
const rdf = require('rdf-ext')

function middleware (req, res, next) {
  if (!req.graph) {
    return next()
  }

  cronify.addTimestamp(req.graph, rdf.createNamedNode(req.iri))

  next()
}

module.exports = middleware

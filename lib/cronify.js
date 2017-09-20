const cronify = require('rdf-cronify')
const rdf = require('rdf-ext')
const url = require('url')

function middleware (store, options, req, res, next) {
  if (!req.graph) {
    return next()
  }

  const iri = rdf.namedNode(req.iri)
  const containerIri = rdf.namedNode(url.resolve(iri.toString(), options.containerPath))

  cronify.store(store, iri, containerIri, req.graph).catch(next)
}

function factory (store, options) {
  options = options || {}
  options.containerPath = options.containerPath || 'history/'

  return middleware.bind(null, store, options)
}

module.exports = factory

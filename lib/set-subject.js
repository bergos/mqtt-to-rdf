const url = require('url')

function middleware (baseUrl, req, res, next) {
  if (!req.json) {
    return next()
  }

  if (!('@id' in req.json)) {
    req.json['@id'] = url.resolve(baseUrl, req.topic.slice(1))
  }

  req.iri = req.json['@id']

  next()
}

function factory (baseUrl) {
  return middleware.bind(null, baseUrl)
}

module.exports = factory

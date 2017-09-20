const rdf = require('rdf-ext')
const JsonldParser = require('rdf-parser-jsonld')
const Readable = require('readable-stream')

function middleware (req, res, next) {
  if (!req.json) {
    return next()
  }

  const input = new Readable({
    read: () => {}
  })

  input.push(JSON.stringify(req.json))
  input.push(null)

  rdf.dataset().import(JsonldParser.import(input, {factory: rdf})).then((graph) => {
    req.graph = graph
  }).then(next).catch(next)
}

module.exports = middleware

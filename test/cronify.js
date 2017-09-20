/* global describe, it */

const assert = require('assert')
const cronify = require('../lib/cronify')
const rdf = require('rdf-ext')
const url = require('url')
const DatasetStore = require('rdf-store-dataset')
const Promise = require('bluebird')

describe('cronify', () => {
  it('should be a factory', () => {
    assert.equal(typeof cronify, 'function')
    assert.equal(cronify.length, 2)
  })

  it('should return a middleware function', () => {
    const middleware = cronify()

    assert.equal(typeof middleware, 'function')
    assert.equal(middleware.length, 3)
  })

  it('should do nothing if the request has no graph property', () => {
    const req = {}

    return Promise.promisify(cronify(null, null))(req, null).then(() => {
      assert(!req.graph)
    })
  })

  it('should cronify the give graph under the defined container path', () => {
    const iri = 'http://example.org/resource'
    const containerPath = 'container'

    const store = new DatasetStore()

    const req = {
      iri: iri,
      graph: rdf.dataset([
        rdf.quad(
          rdf.namedNode(iri),
          rdf.namedNode('http://purl.org/dc/elements/1.1/date'),
          rdf.literal((new Date()).toISOString(), rdf.namedNode('http://www.w3.org/2001/XMLSchema#dateTime'))
        )
      ])
    }

    cronify(store, {containerPath: containerPath})(req, null, () => {
      assert(false)
    })

    return Promise.delay(100).then(() => {
      const container = rdf.namedNode(url.resolve(iri, containerPath))
      const containerGraph = store.dataset.match(null, null, null, container)
      const cronifiedGraph = store.dataset.match(rdf.namedNode(iri))

      assert.equal(containerGraph.match(container, rdf.namedNode('http://www.w3.org/ns/hydra/core#member')).length, 1)
      assert.equal(cronifiedGraph.length, 1)
    })
  })
})

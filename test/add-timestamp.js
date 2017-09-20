/* global describe, it */

const assert = require('assert')
const addTimestamp = require('../lib/add-timestamp')
const rdf = require('rdf-ext')
const Promise = require('bluebird')

describe('add-timestamp', () => {
  it('should be a middleware function', () => {
    assert.equal(typeof addTimestamp, 'function')
    assert.equal(addTimestamp.length, 3)
  })

  it('should do nothing if the request has no graph property', () => {
    const req = {}

    return Promise.promisify(addTimestamp)(req, null).then(() => {
      assert(!req.graph)
    })
  })

  it('should add a timestamp to the graph', () => {
    const iri = 'http://example.org/resource'

    const req = {
      iri: iri,
      graph: rdf.dataset()
    }

    return Promise.promisify(addTimestamp)(req, null).then(() => {
      const dateQuad = req.graph.match(
        rdf.namedNode(iri),
        rdf.namedNode('http://purl.org/dc/elements/1.1/date')).toArray().shift()

      // is there a quad with date predicate?
      assert(dateQuad)

      const date = new Date(dateQuad.object.value)

      // date is less than 1000ms in the past?
      assert((new Date()).valueOf() - date.valueOf() < 1000)
    })
  })
})

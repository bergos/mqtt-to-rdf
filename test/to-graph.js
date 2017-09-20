/* global describe, it */

const assert = require('assert')
const rdf = require('rdf-ext')
const toGraph = require('../lib/to-graph')
const Promise = require('bluebird')

describe('to-graph', () => {
  it('should be a middleware function', () => {
    assert.equal(typeof toGraph, 'function')
    assert.equal(toGraph.length, 3)
  })

  it('should do nothing if the request has no json property', () => {
    const req = {}

    return Promise.promisify(toGraph)(req, null).then(() => {
      assert(!req.graph)
    })
  })

  it('should parse the JSON-LD content', () => {
    const json = {
      '@id': 'http://example.org/test',
      'http://example.org/predicate': 'object'
    }

    const req = {
      json: json
    }

    const expected = rdf.dataset([
      rdf.quad(
        rdf.namedNode('http://example.org/test'),
        rdf.namedNode('http://example.org/predicate'),
        rdf.literal('object')
      )
    ])

    return Promise.promisify(toGraph)(req, null).then(() => {
      assert.equal(req.graph.toCanonical(), expected.toCanonical())
    })
  })

  it('should throw an error on parsing errors', () => {
    const json = {
      '@id': true,
      'http://example.org/predicate': 'object'
    }

    const req = {
      json: json
    }

    return new Promise((resolve, reject) => {
      Promise.promisify(toGraph)(req, null).then(reject).catch(resolve)
    })
  })
})

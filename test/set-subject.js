/* global describe, it */

const assert = require('assert')
const setSubject = require('../lib/set-subject')
const url = require('url')
const Promise = require('bluebird')

describe('set-subject', () => {
  it('should be a factory', () => {
    assert.equal(typeof setSubject, 'function')
    assert.equal(setSubject.length, 1)
  })

  it('should return a middleware function', () => {
    const middleware = setSubject()

    assert.equal(typeof middleware, 'function')
    assert.equal(middleware.length, 3)
  })

  it('should do nothing if the request has no json property', () => {
    const req = {}

    return Promise.promisify(setSubject(null))(req, null).then(() => {
      assert(!req.iri)
    })
  })

  it('should use the topic property and baseUrl if there is no @property', () => {
    const baseUrl = 'http://example.org/resource'
    const topic = '/test'

    const req = {
      topic: topic,
      json: {}
    }

    return Promise.promisify(setSubject(baseUrl))(req, null).then(() => {
      assert.equal(req.iri, url.resolve(baseUrl, topic))
      assert.equal(req.json['@id'], url.resolve(baseUrl, topic))
    })
  })

  it('should use only the @property if it\'s set', () => {
    const baseUrl = 'http://example.org/resource'
    const topic = '/test'

    const req = {
      topic: '/example',
      json: {
        '@id': url.resolve(baseUrl, topic)
      }
    }

    return Promise.promisify(setSubject(baseUrl))(req, null).then(() => {
      assert.equal(req.iri, url.resolve(baseUrl, topic))
      assert.equal(req.json['@id'], url.resolve(baseUrl, topic))
    })
  })
})

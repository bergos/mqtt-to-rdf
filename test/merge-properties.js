/* global describe, it */

const assert = require('assert')
const mergeProperties = require('../lib/merge-properties')
const Promise = require('bluebird')

describe('merge-properties', () => {
  it('should be a factory', () => {
    assert.equal(typeof mergeProperties, 'function')
    assert.equal(mergeProperties.length, 1)
  })

  it('should return a middleware function', () => {
    const middleware = mergeProperties()

    assert.equal(typeof middleware, 'function')
    assert.equal(middleware.length, 3)
  })

  it('should do nothing if the request has no json property', () => {
    const req = {}

    return Promise.promisify(mergeProperties(null))(req, null).then(() => {
      assert(!req.graph)
    })
  })

  it('should merge the properties to the request json object', () => {
    const properties = {
      key1: 'value1'
    }

    const expected = {
      key0: 'value0',
      key1: 'value1'
    }

    const req = {
      json: {
        key0: 'value0'
      }
    }

    return Promise.promisify(mergeProperties(properties))(req, null).then(() => {
      assert.deepEqual(req.json, expected)
    })
  })

  it('should not change properties', () => {
    const properties = {
      key1: 'value1'
    }

    const expected = {
      key1: 'value1'
    }

    const req = {
      json: {
        key0: 'value0'
      }
    }

    return Promise.promisify(mergeProperties(properties))(req, null).then(() => {
      assert.deepEqual(properties, expected)
    })
  })
})

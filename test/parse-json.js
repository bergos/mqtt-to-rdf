/* global describe, it */

const assert = require('assert')
const parseJson = require('../lib/parse-json')
const Promise = require('bluebird')

describe('parse-json', () => {
  it('should be a middleware function', () => {
    assert.equal(typeof parseJson, 'function')
    assert.equal(parseJson.length, 3)
  })

  it('should do nothing if the request has already a json property', () => {
    const obj = {}

    const req = {
      json: obj
    }

    return Promise.promisify(parseJson)(req, null).then(() => {
      assert.equal(req.json, obj)
    })
  })

  it('should do nothing if the payload is not valid', () => {
    const req = {
      payload: 'test'
    }

    return Promise.promisify(parseJson)(req, null).then(() => {
      assert(!req.json)
    })
  })

  it('should parse JSON and assign it to the request object', () => {
    const json = {
      key0: 'value0',
      key1: 'value1'
    }

    const req = {
      payload: JSON.stringify(json)
    }

    return Promise.promisify(parseJson)(req, null).then(() => {
      assert.deepEqual(req.json, json)
    })
  })
})

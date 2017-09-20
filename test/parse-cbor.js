/* global describe, it */

const assert = require('assert')
const cbor = require('borc')
const parseCbor = require('../lib/parse-cbor')
const Promise = require('bluebird')

describe('parse-cbor', () => {
  it('should be a middleware function', () => {
    assert.equal(typeof parseCbor, 'function')
    assert.equal(parseCbor.length, 3)
  })

  it('should do nothing if the request has already a json property', () => {
    const obj = {}

    const req = {
      json: obj
    }

    return Promise.promisify(parseCbor)(req, null).then(() => {
      assert.equal(req.json, obj)
    })
  })

  it('should do nothing if the payload is not valid', () => {
    const req = {
      payload: Buffer.from([0, 0])
    }

    return Promise.promisify(parseCbor)(req, null).then(() => {
      assert(!req.json)
    })
  })

  it('should decode CBOR into JSON and assign it to the request object', () => {
    const json = {
      key0: 'value0',
      key1: 'value1'
    }

    const req = {
      payload: cbor.encode(json)
    }

    return Promise.promisify(parseCbor)(req, null).then(() => {
      assert.deepEqual(req.json, json)
    })
  })
})

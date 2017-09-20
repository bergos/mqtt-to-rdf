/* global describe, it */

const assert = require('assert')
const rewrite = require('../lib/rewrite')
const Promise = require('bluebird')

describe('rewrite', () => {
  it('should be a factory', () => {
    assert.equal(typeof rewrite, 'function')
    assert.equal(rewrite.length, 1)
  })

  it('should return a middleware function', () => {
    const middleware = rewrite()

    assert.equal(typeof middleware, 'function')
    assert.equal(middleware.length, 3)
  })

  it('should do nothing if there is no rewrite rule for the topic', () => {
    const options = {
      map: {
        '/map': '/mapped'
      }
    }

    const req = {
      topic: '/test'
    }

    return Promise.promisify(rewrite(options))(req, null).then(() => {
      assert.equal(req.topic, '/test')
    })
  })

  it('should map the topic as defined in the mapping rule', () => {
    const options = {
      map: {
        '/map': '/mapped'
      }
    }

    const req = {
      topic: '/map'
    }

    return Promise.promisify(rewrite(options))(req, null).then(() => {
      assert.equal(req.topic, '/mapped')
    })
  })
})

/* global describe, it */

const assert = require('assert')
// const cbor = require('borc')
const mqtt = require('mqtt')
const rdf = require('rdf-ext')
const DatasetStore = require('rdf-store-dataset')
const MqttToRdf = require('..')
const Promise = require('bluebird')

describe('MqttToRdf', () => {
  it('should be a constructor', () => {
    assert.equal(typeof MqttToRdf, 'function')
  })

  it('should store a JSON-LD message', () => {
    const json = {
      '@id': 'http://example.org/test',
      'http://example.org/predicate': 'object'
    }

    const store = new DatasetStore()

    const instance = new MqttToRdf({
      store: store
    })

    return instance.listen().then(() => {
      const client = mqtt.connect('mqtt://localhost')

      client.publish('/test', JSON.stringify(json))
      client.end()

      return Promise.delay(100)
    }).then(() => {
      const container = rdf.namedNode('http://example.org/history/')
      const containerGraph = store.dataset.match(null, null, null, container)
      const cronifiedGraph = store.dataset.filter(q => !q.graph.equals(container))

      assert.equal(containerGraph.length, 1)
      assert.equal(cronifiedGraph.length, 2)

      instance.server.close()
    })
  })

  /* it('should store a CBOR message', () => {
    const json = {
      '@id': 'http://example.org/test',
      'http://example.org/predicate': 'object'
    }

    const store = new DatasetStore()

    const instance = new MqttToRdf({
      store: store
    })

    return instance.listen().then(() => {
      const client = mqtt.connect('mqtt://localhost')

      client.publish('/test', cbor.encode(json))
      client.end()

      return Promise.delay(100)
    }).then(() => {
      const container = rdf.namedNode('http://example.org/history/')
      const containerGraph = store.dataset.match(null, null, null, container)
      const cronifiedGraph = store.dataset.filter(q => !q.graph.equals(container))

      assert.equal(containerGraph.length, 1)
      assert.equal(cronifiedGraph.length, 2)

      instance.server.close()

      return Promise.delay(500)
    })
  }) */

  it('should use baseUrl', () => {
    const json = {
      'http://example.org/predicate': 'object'
    }

    const store = new DatasetStore()

    const instance = new MqttToRdf({
      baseUrl: 'http://example.org/',
      store: store
    })

    return instance.listen().then(() => {
      const client = mqtt.connect('mqtt://localhost')

      client.publish('/test', JSON.stringify(json))
      client.end()

      return Promise.delay(100)
    }).then(() => {
      const extendedUrlGraph = store.dataset.match(rdf.namedNode('http://example.org/test'))

      assert.equal(extendedUrlGraph.length, 2)

      instance.server.close()
    })
  })

  it('should rewrite topics', () => {
    const json = {
      'http://example.org/predicate': 'object'
    }

    const store = new DatasetStore()

    const instance = new MqttToRdf({
      baseUrl: 'http://example.org/',
      store: store,
      rewrite: {
        map: {
          '/map': '/mapped'
        }
      }
    })

    return instance.listen().then(() => {
      const client = mqtt.connect('mqtt://localhost')

      client.publish('/map', JSON.stringify(json))
      client.end()

      return Promise.delay(100)
    }).then(() => {
      const rewrittenGraph = store.dataset.match(rdf.namedNode('http://example.org/mapped'))

      assert.equal(rewrittenGraph.length, 2)

      instance.server.close()
    })
  })

  it('should merge global properties', () => {
    const store = new DatasetStore()

    const instance = new MqttToRdf({
      baseUrl: 'http://example.org/',
      store: store,
      properties: {
        global: {
          'http://example.org/predicate': 'object'
        }
      }
    })

    return instance.listen().then(() => {
      const client = mqtt.connect('mqtt://localhost')

      client.publish('/test', JSON.stringify({}))
      client.end()

      return Promise.delay(100)
    }).then(() => {
      const mergedGraph = store.dataset.match(rdf.namedNode('http://example.org/test'))

      assert.equal(mergedGraph.length, 2)

      instance.server.close()
    })
  })

  it('should merge topic properties', () => {
    const store = new DatasetStore()

    const instance = new MqttToRdf({
      baseUrl: 'http://example.org/',
      store: store,
      properties: {
        topics: {
          '/test': {
            'http://example.org/predicate': 'object'
          },
          '/otherTest': {
            'http://example.org/otherPredicate': 'object'
          }
        }
      }
    })

    return instance.listen().then(() => {
      const client = mqtt.connect('mqtt://localhost')

      client.publish('/test', JSON.stringify({}))
      client.end()

      return Promise.delay(100)
    }).then(() => {
      const mergedGraph = store.dataset.match(rdf.namedNode('http://example.org/test'))

      assert.equal(mergedGraph.length, 2)

      instance.server.close()
    })
  })

  it('should add timestamp', () => {
    const store = new DatasetStore()

    const instance = new MqttToRdf({
      baseUrl: 'http://example.org/',
      store: store
    })

    return instance.listen().then(() => {
      const client = mqtt.connect('mqtt://localhost')

      client.publish('/test', JSON.stringify({}))
      client.end()

      return Promise.delay(100)
    }).then(() => {
      const cronifiedGraph = store.dataset.match(null, rdf.namedNode('http://purl.org/dc/elements/1.1/date'))

      assert.equal(cronifiedGraph.length, 1)

      instance.server.close()
    })
  })
})

'use strict'

const cronify = require('./lib/cronify')
const addTimestamp = require('./lib/add-timestamp')
const mergeProperties = require('./lib/merge-properties')
const mors = require('mors')
const parseJson = require('./lib/parse-json')
const rewrite = require('./lib/rewrite')
const setSubject = require('./lib/set-subject')
const toGraph = require('./lib/to-graph')

class MqttToRdf {
  constructor (options) {
    this.verbose = options.verbose

    this.app = options.app

    this.router = mors.Router()

    // log incoming message size
    if (this.verbose) {
      this.router.use((req, res, next) => {
        console.log('received ' + req.payload.length + ' byte message for topic ' + req.topic)

        next()
      })
    }

    // parse JSON message
    this.router.use(parseJson)

    // rewrite topic
    this.router.use(rewrite(options.rewrite))

    // merge global properties
    if (options.properties && options.properties.global) {
      this.router.use(mergeProperties(options.properties.global))
    }

    // merge topic properties
    if (options.properties && options.properties.topics) {
      this.router.use((req, res, next) => {
        if (req.topic in options.properties.topics) {
          const properties = options.properties.topics[req.topic]

          mergeProperties(properties)(req, res, next)
        } else {
          next()
        }
      })
    }

    // set subject
    this.router.use(setSubject(options.baseUrl))

    // convert to rdf graph
    this.router.use(toGraph)

    // add timestamp triple
    this.router.use(addTimestamp)

    // log outgoing graph size
    if (this.verbose) {
      this.router.use((req, res, next) => {
        console.log('write ' + req.graph.length + ' triples to ' + req.iri)

        next()
      })
    }

    // cronify
    this.router.use(cronify(options.store, {
      containerPath: options.containerPath
    }))
  }

  middleware () {
    return this.router
  }

  listen (port) {
    this.app = this.app || mors()

    this.app.use(this.router)

    this.app.listen(port || 1883)

    if (this.verbose) {
      console.log('started MqttToRdf')
    }
  }
}

module.exports = MqttToRdf

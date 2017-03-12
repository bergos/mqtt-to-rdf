'use strict'

const morsSub = require('mors-sub')
const path = require('path')
const shush = require('shush')
const MqttToRdf = require('..')
const SparqlStore = require('rdf-store-sparql')

let program = require('commander')

function init (config) {
  config.store = new SparqlStore({
    endpointUrl: config.sparqlEndpointUrl,
    updateUrl: config.sparqlEndpointUrl
  })
}

function run () {
  let config = {}

  if (program.config) {
    config = shush(path.resolve(program.config))
  }

  config.baseUrl = program.baseUrl || config.baseUrl
  config.broker = program.broker || config.broker
  config.sparqlEndpointUrl = program.endpoint || config.sparqlEndpointUrl

  if (config.broker) {
    config.app = morsSub({
      broker: program.broker
    })
  }

  init(config)

  let mqttToRdf = new MqttToRdf(config)

  mqttToRdf.listen()
}

program
  .option('-v, --verbose', 'verbose output')
  .option('-c, --config <file>', 'config file')
  .option('-u, --baseUrl <URL>', 'base URL')
  .option('-b, --broker <URL>', 'URL of the MQTT broker')
  .option('-e, --endpoint <URL>', 'SPARQL update endpoint URL')

program.parse(process.argv)

run()

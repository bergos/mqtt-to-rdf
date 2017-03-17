#!/usr/bin/env node

/* global exec */

require('shelljs/global')

const path = require('path')

const mqttToSparql = path.join(__dirname, '../bin/mqtt-to-sparql.js')
const configFile = path.join(__dirname, 'config.json')

exec('node ' + mqttToSparql + ' --verbose --config ' + configFile)

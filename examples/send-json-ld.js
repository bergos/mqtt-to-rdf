#!/usr/bin/env node

/* global cat */

require('shelljs/global')

const path = require('path')

const mqttCli = path.join(__dirname, '../node_modules/.bin/mqtt')
const messageFile = path.join(__dirname, 'messages/json-ld.json')
const interval = 5000

setInterval(() => {
  console.log('write JSON-LD message...')
  cat(messageFile).exec(mqttCli + ' publish --stdin /living-room/thermometer')
}, interval)

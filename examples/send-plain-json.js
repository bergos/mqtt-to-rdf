#!/usr/bin/env node

/* global cat */

require('shelljs/global')

const path = require('path')

const mqttCli = path.join(__dirname, '../node_modules/.bin/mqtt')
const messageFile = path.join(__dirname, 'messages/plain-json.json')
const interval = 5000

setInterval(() => {
  console.log('write JSON message...')
  cat(messageFile).exec(mqttCli + ' publish --stdin /home/0/2')
}, interval)

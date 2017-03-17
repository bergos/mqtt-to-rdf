#!/usr/bin/env node

/* global cat */

require('shelljs/global')

const cbor = require('borc')
const mqtt = require('mqtt')
const path = require('path')

const messageJson = JSON.parse(cat(path.join(__dirname, 'messages/plain-json.json')).toString())
const messageCbor = cbor.encode(messageJson)
const interval = 5000

let client = mqtt.connect('mqtt://localhost')

client.on('connect', function () {
  setInterval(() => {
    console.log('write CBOR message...')
    client.publish('/home/0/2', messageCbor)
  }, interval)
})

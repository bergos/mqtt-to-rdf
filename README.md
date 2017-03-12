# mqtt-to-rdf

Forwards MQTT messages to a RDF store

## mqtt-to-sparql

`mqtt-to-sparql` is a command line program which forwards MQTT messages to a SPARQL endpoint.
The following command line options are supported:

- `--config`: Path to a JSON config file.
- `--baseUrl`: Base URL which will be prepended to the MQTT topic.
- `--broker`: URL of the MQTT broker.
  If this parameter is not given a MQTT server will be started.
- `--endpoint`: URL to the SPARQL update endpoint.

### config

The config file must be a JSON file.
JavaScript style comments are allowed.
The following properties are supported:

- `broker`: URL of the MQTT broker.
  If this property is not set and the parameter is not given a MQTT server will be started.
- `baseUrl`: Base URL which will be prepended to the MQTT topic.
- `containerPath`: Path for the cronify container (default: `history/`).
- `sparqlEndpointUrl`: URL to the SPARQL update endpoint.
- `rewrite`: Rewrite rules for the topic.
  If a `map` property is given, the object will be used to do a 1:1 mapping.
  Example:
```
  "rewrite": {
    "map": {
      "/home/0/2": "/bedroom/thermometer"
    }
  }
```
- `properties`: Merge additional properties to the message.
  The value of the `global` property will be merged to all messages.
  It can be used to add a JSON-LD context.
  Example:
```
  "properties": {
    "global": {
      "@context": {
        "@vocab": "http://ns.bergnet.org/dark-horse#"
      }
    }
  }
```
  The `topics` property can be used to merge topic specific values to the message.
  Example:
```
  "properties": {
    "topics": {
      "/bedroom/thermometer": {
        "@type": "Thermometer"
      }
    }
  }

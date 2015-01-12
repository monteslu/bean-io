# Bean-io

Bean-io is a Firmata-compatibility IO class for writing node programs that interact with [LightBlue Bean devices](http://punchthrough.com/bean/). Bean-io was built at [IcedDev](http://iceddev.com/)

### Installation

`npm install bean-io`

### Getting Started

In order to use the bean-io library, you will need to load examples->Firmata-Standard Firmata onto your
Bean device. We recommend you review [Punchthrough's Getting Started guide](http://punchthrough.com/bean/getting-started/) before continuing.

### Linux Instructions

Make sure that libbluetooth-dev and bluez libraries are installed before installing bean-io.

### Blink an Led


The "Hello World" of microcontroller programming:

```js
var beanio = require("bean-io");
var board = new beanio.Board({
  timeout: 30000 //optional - defaults to 30 seconds
  // uuid: 'myUuid' //optional - will use first bean found
});

board.on("ready", function() {
  console.log("CONNECTED");
  this.pinMode(13, this.MODES.OUTPUT);

  var byte = 0;

  // This will "blink" the on board led
  setInterval(function() {
    this.digitalWrite(13, (byte ^= 1));
  }.bind(this), 500);
});
```

### Johnny-Five IO Plugin

Bean-IO can be used as an [IO Plugin](https://github.com/rwaldron/johnny-five/wiki/IO-Plugins) for [Johnny-Five](https://github.com/rwaldron/johnny-five):

```js
var five = require("johnny-five");
var beanio = require("bean-io");
var board = new five.Board({
  io: new beanio.Board()
});

board.on("ready", function() {
  var led = new five.Led({pin: 13});
  led.blink();
});
```


### API

Bean-IO subclasses firmata.js and provides the same API.


### Pin Mappings

Bean to Arduino UNO


| Bean Port | Arduino Pin | Type |
|----------|-------------|------|
|A0|18|Analog/Digital|
|A1|19|AnalogDigital|
|0|6|Digital — Unavailable right now from firmata|
|1|9|Digital — Unavailable right now from firmata|
|2|10|Digital|
|3|11|Digital|
|4|12|Digital|
|5|13|Digital|

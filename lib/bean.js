'use strict';

var SerialPort = require('bean-serial').SerialPort;
var firmata = require('firmata');
var beanAPI = require('ble-bean');
var scan = require('./scan');
var util = require('util');


function Board(options){
  options = options || {};

  var self = this;
  self.name = options.name || 'bean';
  self.pins = []; //j5 is a bit aggressive on wanting this ready
  scan(options.timeout || 30000, beanAPI.UUID, options.uuid || null, function(peripheral){

    if(!peripheral){
      return self.emit(new Error('no beans found'));
    }

    self.beanPeripheral = peripheral;

    self.beanPeripheral.connect(function(){
      console.log('connect bean', self.beanPeripheral.uuid);
      self.beanPeripheral.discoverServices([beanAPI.UUID], function(err, services){
        //console.log('services disovered', services, err);
        if (err){
          self.emit('error', err);
        }
        self.connectedBean = new beanAPI.Bean(services[0]);
        self.connectedBean.once('ready', function(){


          //set color so you know its connected
          self.connectedBean.setColor(new Buffer([0, 64, 64]), function(err){
            console.log('set color', err);
          });

          var serialPort = new SerialPort(self.connectedBean);

          Board.super_.call(self, serialPort, {skipHandshake: true, samplingInterval:60000});


          self.once('ready', function(){
            console.log('firm ready');
            self.isReady = true;
            self.emit('connect');
          });


        });

      });
    });

  });

  //turns off led before disconnecting
  function exitHandler() {
    if (self.beanPeripheral && self.connectedBean) {
      console.log('Disconnecting from Device...');
      self.connectedBean.setColor(new Buffer([0x00,0x00,0x00]), function(){
        //does it hit here?
        console.log('set color reply');
        self.beanPeripheral.disconnect( function(){
          console.log('disconnected');
          process.exit();
        });

      });

    } else {
      process.exit();
    }
  }

  process.on('SIGINT', exitHandler.bind({peripheral:self.beanPeripheral, connectedBean: self.connectedBean}));

}

util.inherits(Board, firmata.Board);

module.exports = {
  Board: Board
};

'use strict';

var noble = require('noble');

module.exports = function(timeout, serviceUuids, deviceUuid, done){

  var timeoutId;

  var onDiscover = function(peripheral){
    console.log('(scan)found:' + peripheral.advertisement.localName, peripheral.uuid);
    if(deviceUuid){
      console.log('matchind device found');
      if(peripheral.uuid === deviceUuid){
        clearTimeout(timeoutId);
        stopScanning();
        done(peripheral);
      }
    }else{
      clearTimeout(timeoutId);
      stopScanning();
      done(peripheral);
    }
  };

  var stopScanning = function (){
    noble.stopScanning();
    noble.removeListener('discover', onDiscover);
    console.log('Stop Scanning for BLE devices...');
  };

  var timedOut = function(){
    stopScanning();
    done(null);
  };

  noble.on('discover', onDiscover);

  if(!Array.isArray(serviceUuids)){
      serviceUuids = [serviceUuids];
  }
  noble.startScanning(serviceUuids);
  timeoutId = setTimeout(timedOut, timeout);
  console.log('Scanning for BLE devices...');
};

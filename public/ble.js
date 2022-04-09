
let BLE = {

  connected: false,
  device: undefined,
  characteristic: undefined,

  SERVICE_UUID: "a2bf82f9-36a0-458b-b41b-bdf3c2924de9",
  CHARACTERISTIC_UUID: "4a644eb4-2c92-429b-b022-d827fa83db5f",
  
  connect: function() {

    Toast.show("BLE connect");

    navigator.bluetooth.requestDevice({
      acceptAllDevices: true
    })
    .then(device => {
      BLE.device = device
      return device.gatt.connect();
    })
    .then(server => {
      return server.getPrimaryService(BLE.SERVICE_UUID);
    })
    .then(service => {
      return service.getCharacteristic(BLE.CHARACTERISTIC_UUID);
    })
    .then(characteristic => {
      BLE.characteristic = characteristic;
      BLE.connected = true;
      Toast.show("BLE connect success");
    });

  },

  disconnect: function() {
    if(BLE.device.gatt.connected) BLE.device.gatt.disconnect();
    BLE.connected = fasle;
  },

  send: function(x) {
    if(!BLE.connected) return;
    BLE.characteristic.writeValue(Uint8Array.of(x));
  }

};

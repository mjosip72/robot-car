
let BLE = {

  connected: false,
  device: undefined,
  characteristic: undefined,

  NAME: "Robot Car",
  SERVICE_UUID: "a2bf82f9-36a0-458b-b41b-bdf3c2924de9",
  CHARACTERISTIC_UUID: "4a644eb4-2c92-429b-b022-d827fa83db5f",
  
  connect: function() {

    Toast.show("BLE connect");

    navigator.bluetooth.requestDevice({
      filters: [
        { name: BLE.NAME },
        { services: [BLE.SERVICE_UUID] }
      ]
    })
    .then(device => {
      BLE.device = device;
      Toast.show("request device");
      return device.gatt.connect();
    })
    .then(server => {
      Toast.show("gat connect");
      return server.getPrimaryService(BLE.SERVICE_UUID);
    })
    .then(service => {
      Toast.show("primary service");
      return service.getCharacteristic(BLE.CHARACTERISTIC_UUID);
    })
    .then(characteristic => {
      Toast.show("characteristic");
      BLE.characteristic = characteristic;
      BLE.connected = true;
      Toast.show("BLE connect success");
    })
    .catch(r => {
      Toast.show(r);
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

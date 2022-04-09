let HID = require('..');

let device_handle

function getDevices() {
  return HID.devices();
}

function openDevice({ path }) {
  let result = true;
  console.log('path:', path);
  try {
    device_handle = new HID.HID(path);
  } catch(e) {
    console.log(e);
    result = false;
  }
  return result;
}

module.exports = {
  getDevices,
  openDevice
}
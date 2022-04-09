let HID = require('..');

let device_handle

async function getDevices() {
  return HID.devices();
}

async function openDevice({ path }) {
  if (device_handle) {
    return false;
  }

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

async function sendFeatureReport({
  data
}) {
  if (!device_handle || !data) {
    return false;
  } 

  let wb = await device_handle.sendFeatureReport(data);

  console.log(`sendFeatureReport ${wb}=?${data.length}`);
  return wb === data.length;
}

async function getFeatureReport({
  reportId,
  reportLength
}) {
  if (!device_handle || !reportId || !reportLength) {
    return false;
  } 

  let receive = await device_handle.getFeatureReport(reportId, reportLength);
  console.log('getFeatureReport receive:', receive);
  return receive;
}

module.exports = {
  getDevices,
  openDevice,
  sendFeatureReport,
  getFeatureReport,
}
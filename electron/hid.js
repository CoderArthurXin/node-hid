/******* 
 * @Author: Arthur Xin
 * @Date: 2022-04-09 11:52:10
 * @LastEditTime: 2022-04-09 14:16:50
 * @LastEditors: Arthur Xin
 * @Description: 
 */
let HID = require('..');

let device_handle

/******* 
 * @Author: Arthur Xin
 * @description: Get host hid devices list
 * @param {*}
 * @return {*}
 */
async function getDevices() {
  return HID.devices();
}

/******* 
 * @Author: Arthur Xin
 * @description: Open hid device
 * @param {*}
 * @return {*}
 */
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

/******* 
 * @Author: Arthur Xin
 * @description: Send feature report
 * @param {*}
 * @return {*}
 */
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

/******* 
 * @Author: Arthur Xin
 * @description: Get feature report
 * @param {*}
 * @return {*}
 */
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
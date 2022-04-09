/******* 
 * @Author: Arthur Xin
 * @Date: 2022-04-09 11:52:10
 * @LastEditTime: 2022-04-09 15:08:22
 * @LastEditors: Arthur Xin
 * @Description: 
 */
let HID = require('..');

let deviceHandleMap = new Map();

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
async function openDevice({ pageId, path }) {
  if (deviceHandleMap.has(pageId)) {
    return true; // alread open
  }

  let result = true;
  console.log('path:', path);
  try {
    let deviceHandle = new HID.HID(path);
    deviceHandleMap.set(pageId, deviceHandle);
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
  pageId,
  data
}) {
  if (!deviceHandleMap.has(pageId) || !data) {
    return false;
  } 

  let wb = await deviceHandleMap.get(pageId).sendFeatureReport(data);

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
  pageId,
  reportId,
  reportLength
}) {
  if (!deviceHandleMap.has(pageId) || !reportId || !reportLength) {
    return false;
  } 

  let receive = await deviceHandleMap.get(pageId).getFeatureReport(reportId, reportLength);
  console.log('getFeatureReport receive:', receive);
  return receive;
}

module.exports = {
  getDevices,
  openDevice,
  sendFeatureReport,
  getFeatureReport,
}
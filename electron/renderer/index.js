const { ipcRenderer } = require('electron');
const { IPC_CHANNEL, VENDOR_ID, HID_ACTION } = require('../common/constants.js');
const nari_ultimate = require('./devices/razer_nari_ultimate.js');

console.log(window.location.hash);

const PAGE_ID = window.location.hash;
let hasOpen = false;

/******* 
 * @Author: Arthur Xin
 * @description: get host hid devices
 * @param {*}
 * @return {*}
 */
function getDevices() {
  ipcRenderer.invoke(IPC_CHANNEL, {
    action: HID_ACTION.GETDEVICES,
  }).then((res) => {
    let {
      success,
      data,
      error
    } = JSON.parse(res);

    if (!success) {
      alert(error || 'Get Devices Fail');
      return;
    }

    console.log('devices:', data);

    let parent = document.getElementById("devices");
    let path = document.getElementById('path');
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((device) => {
        if (device.vendorId !== VENDOR_ID) {
          return;
        }

        // set default path
        if (path.value === '') {
          path.value = device.path;
        }

        // append child
        let msg = `<b>ProductId</b>: 0x${device?.productId.toString(16)}       <b>Path</b>: ${device.path}`;
        let child = document.createElement("div");

        child.innerHTML = msg;
        parent.appendChild(child);
      })
    }
  })
}

/******* 
 * @Author: Arthur Xin
 * @description: Open hid device
 * @param {*}
 * @return {*}
 */
function openDevice() {
  if (hasOpen) {
    alert('already open');
    return;
  }

  let path = document.getElementById("path").value;
  if (!path) {
    alert('please copy PATH from upper list');
    return;
  }
  
  ipcRenderer.invoke(IPC_CHANNEL, {
    action: HID_ACTION.OPENDEVICE,
    payload: {
      pageId: PAGE_ID,
      path: path.trim(),
    }
  }).then((res) => {
    let {
      success,
      data
    } = JSON.parse(res);

    if (success) {
      hasOpen = true;
      alert('open successfully');
    } else {
      alert('open failed');
    }
  })
}

/******* 
 * @Author: Arthur Xin
 * @description: Send data
 * @param {*}
 * @return {*}
 */
async function send() {
  if (!hasOpen) {
    alert('please open device first');
    return;
  }

  return await ipcRenderer.invoke(IPC_CHANNEL, {
    action: HID_ACTION.SENDFEATURE,
    payload: {
      pageId: PAGE_ID,
      data: nari_ultimate.GET_FIRMWARE_VERSION,
    }
  }).then((res) => {
    let {
      success
    } = JSON.parse(res);

    console.log(success ? 'Send Success' : 'Send fail');
    return success;
  })
}


/******* 
 * @Author: Arthur Xin
 * @description: Send and receive data
 * @param {*}
 * @return {*}
 */
async function sendAndReceive() {
  if (!hasOpen) {
    alert('please open device first');
    return;
  }

  let res = await send();
  console.log('send result:', res);
  if (res) {
    ipcRenderer.invoke(IPC_CHANNEL, {
      action: HID_ACTION.GETFEATURE,
      payload: {
        pageId: PAGE_ID,
        reportId: nari_ultimate.REPORT_ID,
        reportLength: nari_ultimate.REPORT_LENGTH,
      }
    }).then((res) => {
      let {
        success,
        data
      } = JSON.parse(res);

      // alert(success ? data : 'receive no data');
      console.log(data);
    })
  }
}

/******* 
 * @Author: Arthur Xin
 * @description: send data
 * @param {*}
 * @return {*}
 */
function loopSend() {
  let loop = 20;
  let interval = setInterval(() => {
    sendAndReceive();
    if (--loop < 1) {
      clearInterval(interval);
      console.log('loop end');
      alert(PAGE_ID + 'loop end');
    }
  }, 1000);
}

getDevices();
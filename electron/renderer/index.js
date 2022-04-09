const { ipcRenderer } = require('electron');
const { IPC_CHANNEL, VENDOR_ID, HID_ACTION } = require('../common/constants.js');

let hasOpen = false;

function getDevices() {
  ipcRenderer.invoke(IPC_CHANNEL, {
    action: HID_ACTION.GETDEVICES,
  }).then(({
    success,
    data,
    error
  }) => {
    if (!success) {
      alert(error || 'Get Devices Fail');
      return;
    }

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
      path: path.trim(),
    }
  }).then(({
    success,
    data
  }) => {
    if (success) {
      alert('open successfully');
    } else {
      alert('open failed');
    }
  })
}

getDevices();
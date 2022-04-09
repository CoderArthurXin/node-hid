const IPC_CHANNEL = 'ipc:channel:node:hid';

const VENDOR_ID = 0X1532;

const HID_ACTION = {
  GETDEVICES: 'getdevices',
  OPENDEVICE: 'opendevice',
}

module.exports = {
  IPC_CHANNEL,
  VENDOR_ID,
  HID_ACTION,
}
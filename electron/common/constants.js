const IPC_CHANNEL = 'ipc:channel:node:hid';

const VENDOR_ID = 0X1532;

const HID_ACTION = {
  GETDEVICES: 'hid_get_devices',
  OPENDEVICE: 'hid_open_device',
  SENDFEATURE: 'hid_send_feature_report',
  GETFEATURE: 'hid_get_feature_report',
  WRITE: 'hid_write',
  READ: 'hid_read'
}

module.exports = {
  IPC_CHANNEL,
  VENDOR_ID,
  HID_ACTION,
}
/******* 
 * @Author: Arthur Xin
 * @Date: 2022-04-09 11:28:48
 * @LastEditTime: 2022-04-09 15:45:21
 * @LastEditors: Arthur Xin
 * @Description: 
 */

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { IPC_CHANNEL, HID_ACTION } = require('./common/constants.js');
const hid = require('./hid.js');

function createWindow (hash) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./renderer/index.html', {
    hash,
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.maximize();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow('page_01');
  createWindow('page_02');

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow('page_01')
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let actionMap = new Map();
actionMap.set(HID_ACTION.GETDEVICES, hid.getDevices);
actionMap.set(HID_ACTION.OPENDEVICE, hid.openDevice);
actionMap.set(HID_ACTION.SENDFEATURE, hid.sendFeatureReport);
actionMap.set(HID_ACTION.GETFEATURE, hid.getFeatureReport);

function formateResponse(success, error = '', data = '', ) {
  return JSON.stringify({
    success,
    error,
    data
  });
}

/******* 
 * @Author: Arthur Xin
 * @description: IPC center
 * @param {*}
 * @return {*}
 */
ipcMain.handle(IPC_CHANNEL, async (event, args) => {
  console.log('action:', args?.action);
  let action = args?.action;
  if (!actionMap.has(action)) {
    return formateResponse(false, 'Action Not Support');
  }

  let result = await actionMap.get(action)(args.payload);
  console.log('action result:', result);
  return formateResponse(!!result, '', result);
});
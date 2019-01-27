/* eslint import/no-unresolved: [2, { ignore: ['electron'] }] */
/* eslint-disable import/no-extraneous-dependencies */

const electron = require('electron');
const menubar = require('menubar');
const path = require('path');
const settings = require('electron-settings');
const url = require('url');

const isDev = require('electron-is-dev');

const loadListeners = require('./listeners');

const createMenu = require('./libs/create-menu');

const {
  app,
  // BrowserWindow,
  clipboard,
  globalShortcut,
  ipcMain,
} = electron;

// const config = require('./config');

// Register protocol
app.setAsDefaultProtocolClient('translatium');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mb;

function createMenubar() {
  if (process.platform !== 'darwin') return;

  // Menubar
  mb = menubar({
    index: isDev ? 'http://localhost:3000' : `file://${path.resolve(__dirname, 'index.html')}`,
    icon: path.resolve(__dirname, 'images', 'iconTemplate.png'),
    width: 400,
    height: 600,
    showDockIcon: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcMain.on('unset-show-menubar-shortcut', (e, combinator) => {
    globalShortcut.unregister(combinator);
  });

  let isHidden = true;

  mb.on('show', () => {
    isHidden = false;
  });

  mb.on('hide', () => {
    isHidden = true;
  });

  ipcMain.on('set-show-menubar-shortcut', (e, combinator) => {
    globalShortcut.register(combinator, () => {
      if (isHidden) {
        mb.showWindow();

        const translateClipboardOnShortcut = settings.get('translateClipboardOnShortcut', false);
        if (translateClipboardOnShortcut) {
          const text = clipboard.readText();
          if (text.length > 0) {
            mb.window.send('set-input-text', text);
          }
        }
      } else {
        mb.hideWindow();
      }
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  loadListeners();
  createMenubar();
  createMenu();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (mainWindow == null) {
  //  createWindow();
  // }
  if (process.platform === 'darwin') {
    mb.showWindow();
  }
});

app.on('open-url', (e, urlStr) => {
  e.preventDefault();

  if (urlStr.startsWith('translatium://')) {
    const urlObj = url.parse(urlStr, true);
    const text = decodeURIComponent(urlObj.query.text || '');

    // if (mainWindow) {
    // mainWindow.send('set-input-lang', 'auto');
    // mainWindow.send('set-input-text', text);
    // }

    if (mb && mb.window) {
      mb.window.send('set-input-lang', 'auto');
      mb.window.send('set-input-text', text);
    }
  }
});

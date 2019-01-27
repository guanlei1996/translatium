const { ipcRenderer } = window.require('electron');

export const requestOpenInBrowser = url => ipcRenderer.send('request-open-in-browser', url);

// Preferences
export const getPreference = name => ipcRenderer.sendSync('get-preference', name);
export const getPreferences = () => ipcRenderer.sendSync('get-preferences');
export const requestSetPreference = (name, value) => ipcRenderer.send('request-set-preference', name, value);
export const requestResetPreferences = () => ipcRenderer.send('request-reset-preferences');

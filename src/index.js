/* global ipcRenderer */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';
import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';

import 'typeface-roboto/index.css';

import './main.css';

import store from './state/reducers';
import { updateStrings } from './state/root/strings/actions';

import colorPairs from './constants/colors';

import App from './components/app';

import loadListeners from './listeners';

export const runApp = (isRestart) => {
  /* global document */
  const state = store.getState();

  loadListeners(store);

  if (!isRestart) {
    // Mock user agent
    Object.defineProperty(
      window.navigator,
      'userAgent',
      {
        get: () => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
      },
    );
  }

  store.dispatch(updateStrings(state.preferences.langId));

  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: createPalette({
      type: state.preferences.darkMode ? 'dark' : 'light',
      primary: colorPairs[state.preferences.primaryColorId],
      secondary: {
        light: pink[300],
        main: pink[500],
        dark: pink[700],
      },
      error: {
        light: red[300],
        main: red[500],
        dark: red[700],
      },
    }),
  });

  render(
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app'),
  );
};

runApp();

const state = store.getState();
const openOnMenubarShortcut = state.preferences.openOnMenubarShortcut;
ipcRenderer.send('set-show-menubar-shortcut', openOnMenubarShortcut);

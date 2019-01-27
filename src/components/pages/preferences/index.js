/* global remote shell */
import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../../helpers/connect-component';

import EnhancedMenu from '../enhanced-menu';

import { togglePreference } from '../../../state/root/preferences/actions';
import { updateStrings } from '../../../state/root/strings/actions';
import { openShortcutDialog } from '../../../state/pages/preferences/shortcut-dialog/actions';

import { requestSetPreference } from '../../../senders';

import colorPairs from '../../../constants/colors';
import displayLanguages from '../../../constants/display-languages';

import DialogShortcut from './dialog-shortcut';

const styles = theme => ({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    boxSizing: 'border-box',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  paperTitle: {
    width: '100%',
    maxWidth: 720,
    margin: '0 auto',
    color: theme.palette.text.primary,
    marginBottom: 4,
    paddingLeft: 16,
    fontSize: 15,
    '&:not(:first-child)': {
      marginTop: 36,
    },
  },
  paper: {
    maxWidth: 720,
    margin: '0 auto',
  },
  icon: {
    height: 96,
    width: 96,
  },
});

const renderCombinator = combinator => combinator
  .replace(/\+/g, ' + ')
  .replace('alt', window.platform === 'win32' ? 'alt' : '⌥')
  .replace('shift', window.platform === 'win32' ? 'shift' : '⇧')
  .replace('mod', window.platform === 'win32' ? 'ctrl' : '⌘')
  .replace('meta', '⌘')
  .toUpperCase();

const Settings = (props) => {
  const {
    chinaMode,
    classes,
    langId,
    onOpenShortcutDialog,
    onToggle,
    onUpdateStrings,
    primaryColorId,
    realtime,
    strings,
    translateWhenPressingEnter,
    translateClipboardOnShortcut,

    openOnMenubarShortcut,
  } = props;

  const shortcuts = [
    { identifier: 'openOnMenubar', combinator: openOnMenubarShortcut },
  ];

  return (
    <div className={classes.container}>
      <DialogShortcut />
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">{strings.preferences}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.innerContainer}>
        <Typography variant="h6" className={classes.paperTitle}>
          {strings.appearance}
        </Typography>
        <Paper className={classes.paper}>
          <List dense>
            <EnhancedMenu
              id="changeColor"
              buttonElement={(
                <ListItem button>
                  <ListItemText
                    primary={strings.primaryColor}
                    secondary={strings[primaryColorId]}
                  />
                  <ChevronRightIcon color="action" />
                </ListItem>
              )}
            >
              {Object.keys(colorPairs).map(colorId => (
                <MenuItem
                  key={`color_${colorId}`}
                  value={colorId}
                  onClick={() => {
                    requestSetPreference('primaryColorId', colorId);
                    remote.app.relaunch();
                    remote.app.quit();
                  }}
                >
                  {strings[colorId]}
                </MenuItem>
              ))}
            </EnhancedMenu>
            <Divider />
            <EnhancedMenu
              id="changeDisplayLanguage"
              buttonElement={(
                <ListItem>
                  <ListItemText
                    primary={strings.displayLanguage}
                    secondary={langId === 'automatic' ? strings.automatic : displayLanguages[langId].displayName}
                  />
                  <ChevronRightIcon color="action" />
                </ListItem>
              )}
            >
              <MenuItem
                value="automatic"
                onClick={() => {
                  if (langId !== 'automatic') {
                    requestSetPreference('langId', 'automatic');
                    onUpdateStrings('automatic');
                  }
                }}
              >
                {strings.automatic}
              </MenuItem>
              {Object.keys(displayLanguages).map(lId => (
                <MenuItem
                  key={`lang_${lId}`}
                  value={lId}
                  onClick={() => {
                    if (lId !== langId) {
                      requestSetPreference('langId', lId);
                      onUpdateStrings(lId);
                    }
                  }}
                >
                  {displayLanguages[lId].displayName}
                </MenuItem>
              ))}
            </EnhancedMenu>
          </List>
        </Paper>

        <Typography variant="h6" className={classes.paperTitle}>
          {strings.advanced}
        </Typography>
        <Paper className={classes.paper}>
          <List dense>
            <ListItem>
              <ListItemText primary={strings.realtime} />
              <ListItemSecondaryAction>
                <Switch
                  checked={realtime}
                  onChange={() => onToggle('realtime')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={strings.chinaMode}
                secondary={strings.chinaModeDesc}
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={chinaMode}
                  onChange={() => onToggle('chinaMode')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            {window.platform === 'darwin' && (
              <ListItem
                button
                onClick={() => shell.openExternal('https://translatiumapp.com/popclip')}
              >
                <ListItemText primary={strings.popclipExtension} />
              </ListItem>
            )}
          </List>
        </Paper>

        <Typography variant="h6" className={classes.paperTitle}>
          {strings.shortcuts}
        </Typography>
        <Paper className={classes.paper}>
          <List dense>
            <ListItem>
              <ListItemText primary={strings.translateWhenPressingEnter} />
              <ListItemSecondaryAction>
                <Switch
                  checked={translateWhenPressingEnter}
                  onChange={() => onToggle('translateWhenPressingEnter')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            {window.platform === 'darwin' && (
              <React.Fragment>
                <ListItem>
                  <ListItemText
                    primary={strings.translateClipboardOnShortcut}
                    secondary={strings.translateClipboardOnShortcutDesc}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={translateClipboardOnShortcut}
                      onChange={() => onToggle('translateClipboardOnShortcut')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                {shortcuts.map(({ identifier, combinator }) => (
                  <React.Fragment key={identifier}>
                    <Divider />
                    <ListItem
                      button
                      onClick={() => onOpenShortcutDialog(identifier, combinator)}
                    >
                      <ListItemText
                        primary={strings[identifier]}
                        secondary={renderCombinator(combinator)}
                      />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                  </React.Fragment>
                ))}
              </React.Fragment>
            )}
          </List>
        </Paper>

        <Typography variant="h6" className={classes.paperTitle} />
        <Paper className={classes.paper}>
          <List dense>
            <ListItem>
              <ListItemText primary={`Translatium v${remote.app.getVersion()}`} />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => shell.openExternal('https://translatiumapp.com')}>
              <ListItemText primary={strings.website} />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => shell.openExternal('https://translatiumapp.com/support')}>
              <ListItemText primary={strings.support} />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => shell.openExternal('ms-windows-store://review/?ProductId=9wzdncrcsg9k')}>
              <ListItemText primary={strings.rateWindowsStore} />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => shell.openExternal('macappstore://itunes.apple.com/app/id1176624652?mt=12')}>
              <ListItemText primary={strings.rateMacAppStore} />
            </ListItem>
          </List>
        </Paper>


        <Typography variant="h6" className={classes.paperTitle} />
        <Paper className={classes.paper}>
          <List dense>
            <ListItem button>
              <ListItemText primary={strings.quit} onClick={() => remote.app.quit()} />
            </ListItem>
          </List>
        </Paper>
      </div>
    </div>
  );
};

Settings.propTypes = {
  chinaMode: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  langId: PropTypes.string.isRequired,
  onOpenShortcutDialog: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onUpdateStrings: PropTypes.func.isRequired,
  primaryColorId: PropTypes.string.isRequired,
  realtime: PropTypes.bool.isRequired,
  strings: PropTypes.objectOf(PropTypes.string).isRequired,
  translateWhenPressingEnter: PropTypes.bool.isRequired,
  translateClipboardOnShortcut: PropTypes.bool.isRequired,

  openOnMenubarShortcut: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  chinaMode: state.preferences.chinaMode,
  darkMode: state.preferences.darkMode,
  langId: state.preferences.langId,
  primaryColorId: state.preferences.primaryColorId,
  realtime: state.preferences.realtime,
  strings: state.strings,
  translateWhenPressingEnter: state.preferences.translateWhenPressingEnter,
  translateClipboardOnShortcut: state.preferences.translateClipboardOnShortcut,

  openOnMenubarShortcut: state.preferences.openOnMenubarShortcut,
});

const mapDispatchToProps = dispatch => ({
  onToggle: name => dispatch(togglePreference(name)),
  onUpdateStrings: langId => dispatch(updateStrings(langId)),
  onOpenShortcutDialog: (identifier, combinator) => dispatch(
    openShortcutDialog(identifier, combinator),
  ),
});

export default connectComponent(
  Settings,
  mapStateToProps,
  mapDispatchToProps,
  styles,
);

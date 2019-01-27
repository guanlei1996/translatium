import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import connectComponent from '../../../helpers/connect-component';

import {
  closeShortcutDialog,
  setCombinator,
} from '../../../state/pages/preferences/shortcut-dialog/actions';
import { setPreference } from '../../../state/root/preferences/actions';

const styles = {
  combinatorContainer: {
    marginTop: 12,
  },
  plusText: {
    paddingLeft: 12,
    paddingRight: 12,
  },
};

const renderCombinator = combinator => combinator
  .replace(/\+/g, ' + ')
  .replace('alt', window.platform === 'win32' ? 'Alt' : '⌥')
  .replace('shift', window.platform === 'win32' ? 'Shift' : '⇧')
  .replace('mod', window.platform === 'win32' ? 'Ctrl' : '⌘')
  .replace('meta', '⌘')
  .toUpperCase();


class DialogShortcut extends React.Component {
  componentDidMount() {
    const { onSetCombinator } = this.props;

    window.onkeydown = (e) => {
      const pressed = [];

      if (e.keyCode === 16) return;

      if (e.ctrlKey) pressed.push('ctrl');
      if (e.metaKey) pressed.push('meta');
      if (e.altKey) pressed.push('alt');
      if (e.shiftKey) pressed.push('shift');

      pressed.push(String.fromCharCode(e.keyCode).toLowerCase());

      if (pressed.length < 2) return;

      onSetCombinator(pressed.join('+'));
    };
  }

  componentWillUnmount() {
    window.onkeydown = null;
  }

  render() {
    const {
      classes,
      combinator,
      identifier,
      onCloseShortcutDialog,
      onUpdateSettings,
      open,
      strings,
    } = this.props;

    return (
      <Dialog open={open} onRequestClose={onCloseShortcutDialog}>
        <DialogTitle>
          {strings[identifier] || ''}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Type the new keyboard combinator.
          </DialogContentText>
          <DialogContentText className={classes.combinatorContainer}>
            {combinator && combinator !== '+' && combinator.split('+').map((key, i) => (
              <span key={key}>
                {i > 0 && <span className={classes.plusText}>+</span>}
                {renderCombinator(key)}
              </span>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseShortcutDialog}>
            {strings.cancel}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              onUpdateSettings(`${identifier}Shortcut`, combinator);
              onCloseShortcutDialog();
            }}
          >
            {strings.save}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DialogShortcut.defaultProps = {
  identifier: null,
  combinator: null,
};

DialogShortcut.propTypes = {
  classes: PropTypes.object.isRequired,
  combinator: PropTypes.string,
  identifier: PropTypes.string,
  onCloseShortcutDialog: PropTypes.func.isRequired,
  onSetCombinator: PropTypes.func.isRequired,
  onUpdateSettings: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  strings: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  combinator: state.pages.preferences.shortcutDialog.combinator,
  identifier: state.pages.preferences.shortcutDialog.identifier,
  open: state.pages.preferences.shortcutDialog.open,
  strings: state.strings,
});

const mapDispatchToProps = dispatch => ({
  onCloseShortcutDialog: () => dispatch(closeShortcutDialog()),
  onSetCombinator: combinator => dispatch(setCombinator(combinator)),
  onUpdateSettings: (name, value) => dispatch(setPreference(name, value)),
});

export default connectComponent(
  DialogShortcut,
  mapStateToProps,
  mapDispatchToProps,
  styles,
);

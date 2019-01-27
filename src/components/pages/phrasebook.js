import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ToggleStar from '@material-ui/icons/Star';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';

import connectComponent from '../../helpers/connect-component';

import { deletePhrasebookItem, loadPhrasebook } from '../../state/pages/phrasebook/actions';
import { loadOutput } from '../../state/pages/home/actions';
import { changeRoute } from '../../state/root/router/actions';

import { ROUTE_HOME } from '../../constants/routes';

const styles = theme => ({
  emptyContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyInnerContainer: {
    textAlign: 'center',
  },
  bigIcon: {
    height: 96,
    width: 96,
    color: theme.palette.text.primary,
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    padding: 0,
    boxSizing: 'border-box',
  },
  progress: {
    marginTop: 12,
  },
});

class Phrasebook extends React.Component {
  componentDidMount() {
    const { onEnterPhrasebook, onLoadMore } = this.props;

    onEnterPhrasebook();

    if (this.listView) {
      this.listView.onscroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = this.listView;
        const { canLoadMore, phrasebookLoading } = this.props;

        if (scrollTop + clientHeight > scrollHeight - 200) {
          if (canLoadMore === true && phrasebookLoading === false) {
            onLoadMore();
          }
        }
      };
    }
  }

  componentWillUnmount() {
    if (this.listView) this.listView.onscroll = null;
  }

  render() {
    const {
      classes,
      phrasebookItems,
      phrasebookLoading,
      strings,
      onDeleteButtonClick,
      onItemClick,
    } = this.props;

    return (
      <div className={classes.container}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">{strings.phrasebook}</Typography>
          </Toolbar>
        </AppBar>
        {(() => {
          if (phrasebookItems.length < 1 && phrasebookLoading === false) {
            return (
              <div className={classes.emptyContainer}>
                <div className={classes.emptyInnerContainer}>
                  <ToggleStar className={classes.bigIcon} />
                  <Typography variant="h6">{strings.phrasebookIsEmpty}</Typography>
                </div>
              </div>
            );
          }

          return (
            <div className={classes.listContainer} ref={(c) => { this.listView = c; }}>
              <List>
                {phrasebookItems.map(item => [(
                  <ListItem
                    button
                    key={`phrasebookItem_${item.phrasebookId}`}
                    onClick={() => onItemClick(item)}
                  >
                    <ListItemText
                      primary={item.outputText}
                      secondary={item.inputText}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title={strings.remove} placement="left">
                        <IconButton
                          aria-label={strings.removeFromPhrasebook}
                          onClick={() => {
                            onDeleteButtonClick(
                              item.phrasebookId,
                              item.rev,
                            );
                          }}
                        >
                          <ToggleStar />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ), <Divider inset={false} />])}
              </List>
              {phrasebookLoading && (
                <LinearProgress variant="indeterminate" className={classes.progress} />
              )}
            </div>
          );
        })()}
      </div>
    );
  }
}

Phrasebook.propTypes = {
  canLoadMore: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onDeleteButtonClick: PropTypes.func.isRequired,
  onEnterPhrasebook: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  phrasebookItems: PropTypes.arrayOf(PropTypes.object),
  phrasebookLoading: PropTypes.bool,
  strings: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  phrasebookItems: state.pages.phrasebook.items,
  canLoadMore: state.pages.phrasebook.canLoadMore,
  phrasebookLoading: state.pages.phrasebook.loading,
  strings: state.strings,
});

const mapDispatchToProps = dispatch => ({
  onItemClick: (output) => {
    dispatch(loadOutput(output));
    dispatch(changeRoute(ROUTE_HOME));
  },
  onDeleteButtonClick: (id, rev) => dispatch(deletePhrasebookItem(id, rev)),
  onEnterPhrasebook: () => dispatch(loadPhrasebook(true)),
  onLoadMore: () => dispatch(loadPhrasebook()),
});

export default connectComponent(
  Phrasebook,
  mapStateToProps,
  mapDispatchToProps,
  styles,
);

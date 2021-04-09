import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';

class MsgBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbarOpen: true,
    };
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({snackbarOpen: false});
  };

  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.snackbarOpen}
        autoHideDuration={6000}
        onClose={this.handleClose}
      >
        <MuiAlert elevation={6} variant="filled" severity={this.props.severity}>
          {this.props.msg}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            style={{marginLeft: '20px'}}
            onClick={this.handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </MuiAlert>
      </Snackbar>
    );
  }
}

export default MsgBar;

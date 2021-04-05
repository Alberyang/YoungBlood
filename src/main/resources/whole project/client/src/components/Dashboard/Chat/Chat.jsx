import React, {Component} from 'react';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  section: {
    height: '120px',
    backgroundColor: '#094183',
  },
  heading: {
    color: '#fff',
    fontSize: '36px',
  },
});

class Chat extends Component {
  render() {
    const {classes} = this.props;
    return (
      <div align="center">
        <div id="square_banner" className={classes.section}>
          <br />
          <br />
          <Typography variant="h1" className={classes.heading}>
            Chat
          </Typography>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Chat)));

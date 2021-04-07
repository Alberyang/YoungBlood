import React, {Component} from 'react';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';

import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoIcon from '@material-ui/icons/Photo';
import CloseIcon from '@material-ui/icons/Close';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Snackbar from '@material-ui/core/Snackbar';

import EmojiPicker from './Emoji';
import MomentCard from './MomentCard';
import MomentImage from './MomentImage';
import ReactDOM from 'react-dom';
import axios from '../../../helpers/axiosConfig';

const styles = {
  box_card: {
    margin: '20px',
    height: '250px',
    width: '70%',
  },
  box_textarea: {
    marginTop: '20px',
    width: '90%',
  },
  box_submitbtn: {
    textTransform: 'none',
    marginRight: '5%',
    marginLeft: 'auto',
  },
  box_btns: {
    marginLeft: '5%',
    marginRight: 'auto',
  },
};

class MomentBox extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
      textArea: undefined,
      snackbarOpen: false,
      moment_id: undefined,
      image_expanded: false,
      files: undefined,
    };
    this.divRerf = React.createRef();
  }
  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };
  handleImageExpandClick = () => {
    this.setState({
      image_expanded: !this.state.image_expanded,
    });
  };
  componentDidMount = () => {
    const node = this.divRerf.current;
    this.setState({
      textArea: node,
    });
  };
  loadMomemtImages = (data) => {
    this.setState({
      files: data,
    });
  };
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({snackbarOpen: false});
  };

  async postImages(moment_id, data) {
    const response = await axios
      .post(`/moment/upload/${moment_id}`, data)
      .then((res) => {
        window.location.reload(true);
      });
    return response;
  }

  async postMoment(data) {
    const response = await axios.post('/moment/content', data).then((res) => {
      let moment_id = res.data.moment_id;
      this.setState({moment_id: moment_id});
      if (this.state.files) {
        const formData = new FormData();
        this.state.files.map((file) => {
          formData.append('files', file);
        });
        const image_res = this.postImages(moment_id, formData);
      } else {
        window.location.reload(true);
      }
    });
    return response;
  }

  publishMoment = () => {
    const text = document.getElementById('moment_textarea').value;
    if (text === '') {
      this.setState({snackbarOpen: true});
      return;
    }
    let momentData = {
      contents: text,
    };
    let response = this.postMoment(momentData);
  };

  render() {
    const {classes} = this.props;
    return (
      <div
        align="center"
        style={{
          position: 'relative',
        }}
      >
        <Card className={classes.box_card}>
          <CardContent>
            <TextField
              id="moment_textarea"
              className={classes.box_textarea}
              inputRef={this.divRerf}
              rows={5}
              label="Start a post..."
              placeholder="What's happening?"
              multiline
              variant="outlined"
            />
          </CardContent>
          <CardActions align="left" disableSpacing>
            <div className={classes.box_btns}>
              <IconButton
                aria-label="upload photos"
                onClick={this.handleImageExpandClick}
              >
                <PhotoIcon />
              </IconButton>
              <IconButton
                aria-label="insert a emoji"
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
              >
                <EmojiEmotionsIcon />
              </IconButton>
              <Collapse
                in={this.state.expanded}
                style={{
                  position: 'absolute',
                  zIndex: '2',
                  left: '30%',
                  top: '70%',
                }}
              >
                <EmojiPicker node={this.state.textArea} />
                <button
                  style={{
                    position: 'absolute',
                    zIndex: '3',
                    top: '0px',
                    right: '0px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '3px',
                  }}
                  onClick={this.handleExpandClick}
                >
                  x
                </button>
              </Collapse>
              <Collapse
                in={this.state.image_expanded}
                style={{
                  position: 'absolute',
                  width: '40%',
                  zIndex: '2',
                  left: '30%',
                  top: '70%',
                }}
              >
                <MomentImage loadImages={this.loadMomemtImages} />
                <button
                  style={{
                    position: 'absolute',
                    zIndex: '3',
                    top: '0px',
                    right: '0px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '3px',
                  }}
                  onClick={this.handleImageExpandClick}
                >
                  x
                </button>
              </Collapse>
            </div>
            <Button
              variant="contained"
              color="primary"
              className={classes.box_submitbtn}
              onClick={this.publishMoment}
            >
              Publish
            </Button>
          </CardActions>
        </Card>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message="Please input something!"
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={this.handleClose}>
                UNDO
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(MomentBox))
);

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
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';

import EmojiPicker from './Emoji';
import MomentCard from './MomentCard';
import MomentImage from './MomentImage';
import ReactDOM from 'react-dom';
import MsgBar from './MessageBar';
import axios from '../../../helpers/axiosConfig';

const styles = {
  box_card: {
    margin: '20px',
    height: '250px',
    width: '100%',
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
      snackbar: undefined,
      moment_id: undefined,
      image_expanded: false,
      files: [],
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

  postMomentSuccess() {
    this.setState({
      snackbar: (
        <MsgBar msg="Successfully posting a moment!" severity="success" />
      ),
    });
    setTimeout(() => this.setState({snackbar: undefined}), 3 * 1000);
  }

  async fetchNewMoment(moment_id) {
    const response = await axios.get(
      `http://121.4.57.204:8080/info/detail/${moment_id}`
    );
    return response;
  }

  async postMoment(data) {
    const formData = new FormData();
    if (this.state.files) {
      this.state.files.map((file) => {
        formData.append('files', file);
      });
    }
    formData.append('contents', data.contents);
    const response = await axios
      .post('http://121.4.57.204:8080/info/606c453064ad461348e31a23', formData)
      .then((res) => {
        this.postMomentSuccess();
        this.fetchNewMoment(res.data.data).then((res) => {
          let newMoment = res.data.data;
          this.props.moments.unshift(newMoment);
          this.props.updateMoments(this.props.moments);
          this.props.updateView(true);
          this.props.updateView(false);
        });
      });
    return response;
  }

  publishMoment = () => {
    const text = document.getElementById('moment_textarea').value;
    if (text === '') {
      this.setState({
        snackbar: <MsgBar msg="Please input something!" severity="error" />,
      });
      setTimeout(() => this.setState({snackbar: undefined}), 3 * 1000);
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
                  width: '50%',
                  zIndex: '2',
                  left: '30%',
                  top: '70%',
                }}
              >
                <MomentImage
                  currentFiles={this.state.files}
                  loadImages={this.loadMomemtImages}
                />
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
        {this.state.snackbar}
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

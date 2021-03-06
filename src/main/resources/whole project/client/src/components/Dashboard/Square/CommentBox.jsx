import React, {Component} from 'react';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Collapse from '@material-ui/core/Collapse';
import EmojiPicker from './Emoji';
import axios from '../../../helpers/axiosConfig';
import MsgBar from './MessageBar';

const styles = {
  box_card: {
    margin: '20px',
    height: '250px',
  },
  box_textarea: {
    marginTop: '20px',
    width: '100%',
  },
  emoji_btn: {
    marginRight: 'auto',
  },
  box_submitbtn: {
    marginLeft: 'auto',
  },
};

class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      textArea: undefined,
      moment_id: this.props.moment_id,
      username: this.props.user.user.username,
      snackbar: undefined,
    };
    this.divRerf = React.createRef();
  }

  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  componentDidMount() {
    const node = this.divRerf.current;
    this.setState({
      textArea: node,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.moment_id !== nextProps.moment_id) {
      if (this.divRerf.current) {
        this.divRerf.current.value = '';
      }
      this.props.setExpanded(false);
    }
    return true;
  }

  async postComment(data, moment_id) {
    const response = await axios
      .post(
        `http://121.4.57.204:8080/info/review/${moment_id}/${this.props.user.user._id}`,
        data
      )
      .then((res) => {
        let newComment = {
          id: res.data.data,
          username: this.state.username,
          contents: data.contents,
          createDate: parseInt(new Date().getTime() / 1000),
        };
        this.divRerf.current.value = '';
        this.setState({
          snackbar: (
            <MsgBar msg="Successfully commenting!" severity="success" />
          ),
        });
        setTimeout(() => this.setState({snackbar: undefined}), 3 * 1000);
        // shallow copy and force update
        this.props.comments.unshift(newComment);
        this.props.updateComments(this.props.comments);
        this.props.updateView(1);
        this.props.updateView(0);
      });
    return response;
  }

  publicComment = () => {
    const text = this.divRerf.current.value;
    if (text === '') {
      this.setState({
        snackbar: <MsgBar msg="Please input something!" severity="error" />,
      });
      setTimeout(() => this.setState({snackbar: undefined}), 3 * 1000);
      return;
    }
    let commentData = {
      contents: text,
    };
    this.postComment(commentData, this.state.moment_id);
  };

  render() {
    const {classes} = this.props;
    return (
      <div align="center" style={{position: 'relative'}}>
        <Card
          className={classes.box_card}
          style={{border: 'none', boxShadow: 'none'}}
        >
          <CardContent>
            <TextField
              inputRef={this.divRerf}
              className={classes.box_textarea}
              id="outlined-textarea"
              rows={5}
              label="Comment"
              placeholder="Make a comment..."
              multiline
              variant="outlined"
            />
          </CardContent>
          <CardActions>
            <IconButton
              aria-label="insert a emoji"
              className={classes.emoji_btn}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
            >
              <EmojiEmotionsIcon />
            </IconButton>
            <Button
              className={classes.box_submitbtn}
              variant="contained"
              color="primary"
              onClick={this.publicComment}
            >
              Comment
            </Button>
            <Collapse
              in={this.state.expanded}
              style={{
                position: 'absolute',
                zIndex: '2',
                left: '15%',
                bottom: '0',
              }}
            >
              <EmojiPicker node={this.state.textArea} />
              <button
                style={{
                  position: 'absolute',
                  zIndex: '3',
                  top: '0px',
                  right: '5px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '3px',
                }}
                onClick={this.handleExpandClick}
              >
                x
              </button>
            </Collapse>
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
  connect(mapStateToProps)(withStyles(styles)(CommentBox))
);

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
    textTransform: 'none',
    marginLeft: 'auto',
  },
};

class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      textArea: undefined,
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

  async postComment(data, moment_id) {
    const response = await axios
      .post(`/moment/comment/${moment_id}`, data)
      .then((res) => {
        let myDate = new Date();
        let newComment = {
          username: this.props.user.user.username,
          contents: data.contents,
          createdAt:
            myDate.toLocaleDateString() +
            'T' +
            myDate.toLocaleTimeString() +
            '.',
        };
        this.props.updateComments(this.props.comments.push(newComment));
      });
    return response;
  }

  publicComment = () => {
    const text = this.divRerf.current.value;
    let commentData = {
      contents: text,
    };
    let response = this.postComment(commentData, this.props.moment_id);
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
          </CardActions>
        </Card>
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

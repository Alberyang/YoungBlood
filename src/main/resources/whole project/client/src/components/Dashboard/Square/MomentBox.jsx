import React, { Component } from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoIcon from "@material-ui/icons/Photo";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";

import EmojiPicker from "./Emoji";
import MomentCard from "./MomentCard";
import ReactDOM from "react-dom";

const styles = {
  box_card: {
    margin: "20px",
    height: "250px",
    width: "70%",
  },
  box_textarea: {
    marginTop: "20px",
    width: "90%",
  },
  box_submitbtn: {
    textTransform: "none",
    marginRight: "5%",
    marginLeft: "auto",
  },
  box_btns: {
    marginLeft: "5%",
    marginRight: "auto",
  },
};

class MomentBox extends Component {
  constructor() {
    super();
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
  publicMoment() {
    const text = document.getElementById("moment_textarea").value;
    let moment = {
      user: "Yichao Xu1",
      time: "2021-03-20 18:00",
      contents: text,
      comments: [],
      pic_src: [],
    };
    ReactDOM.render(
      <MomentCard moment={moment} />,
      document.getElementById("moment_card")
    );
  }
  render() {
    const { classes } = this.props;
    return (
      <div
        align="center"
        style={{
          position: "relative",
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
              <IconButton aria-label="upload photos">
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
                  position: "absolute",
                  zIndex: "2",
                  left: "30%",
                  top: "70%",
                }}
              >
                <EmojiPicker node={this.state.textArea} />
                <button
                  style={{
                    position: "absolute",
                    zIndex: "3",
                    top: "0px",
                    right: "0px",
                    background: "transparent",
                    border: "none",
                    fontSize: "3px",
                  }}
                  onClick={this.handleExpandClick}
                >
                  x
                </button>
              </Collapse>
            </div>
            <Button
              variant="contained"
              color="primary"
              className={classes.box_submitbtn}
              onClick={this.publicMoment}
            >
              Publish
            </Button>
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
  connect(mapStateToProps)(withStyles(styles)(MomentBox))
);

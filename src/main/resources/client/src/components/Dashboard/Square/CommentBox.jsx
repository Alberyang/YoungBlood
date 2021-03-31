import React, { Component } from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

const styles = {
  box_card: {
    margin: "20px",
    height: "250px",
  },
  box_textarea: {
    marginTop: "20px",
    width: "100%",
  },
  box_submitbtn: {
    textTransform: "none",
    marginLeft: "auto",
  },
};

class CommentBox extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div align="center">
        <Card
          className={classes.box_card}
          style={{ border: "none", boxShadow: "none" }}
        >
          <CardContent>
            <TextField
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
            <Button
              className={classes.box_submitbtn}
              variant="contained"
              color="primary"
            >
              Comment
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
  connect(mapStateToProps)(withStyles(styles)(CommentBox))
);

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import axios from "../../../helpers/axiosConfig";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoIcon from "@material-ui/icons/Photo";

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
  box_photobtn: {
    marginLeft: "5%",
    marginRight: "auto",
  },
};

class MomentBox extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div align="center">
        <Card className={classes.box_card}>
          <CardContent>
            <TextField
              className={classes.box_textarea}
              id="outlined-textarea"
              rows={5}
              label="Start a post..."
              placeholder="What's happening?"
              multiline
              variant="outlined"
            />
          </CardContent>
          <CardActions>
            <IconButton
              className={classes.box_photobtn}
              aria-label="upload photos"
            >
              <PhotoIcon />
            </IconButton>
            <Button
              className={classes.box_submitbtn}
              variant="contained"
              color="primary"
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

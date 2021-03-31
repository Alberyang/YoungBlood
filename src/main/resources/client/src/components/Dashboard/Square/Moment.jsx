import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import axios from "../../../helpers/axiosConfig";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import MomentBox from "./MomentBox";
import MomentCard from "./MomentCard";

const styles = (theme) => ({
  section: {
    height: "120px",
    backgroundColor: "#094183",
  },
  heading: {
    color: "#fff",
    fontSize: "36px",
  },
  moments: {
    width: "70%",
  },
});

class Moment extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes } = this.props;
    return (
      <div align="center">
        <div id="square_banner" className={classes.section}>
          <br />
          <br />
          <Typography variant="h1" className={classes.heading}>
            Square
          </Typography>
        </div>
        <MomentBox />
        <Card className={classes.moments}>
          <CardContent>
            <MomentCard />
            <MomentCard />
          </CardContent>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Moment)));

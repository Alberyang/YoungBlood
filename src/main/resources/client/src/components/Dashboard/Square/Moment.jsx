import React, { Component } from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";

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
    this.state = {
      moments: [
        {
          user: "Yichao Xu1",
          time: "2021-03-20 18:00",
          contents: "我惠天下第一~",
          comments: [
            { user: "Yichao Xu2", time: "2021-03-20 19:00", contents: "赞同" },
            { user: "Yichao Xu3", time: "2021-03-21 20:00", contents: "+1" },
          ],
          pic_src: ["1.jpg"],
        },
        {
          user: "Yichao Xu2",
          time: "2021-03-30 19:00",
          contents: "我惠美如画中仙",
          comments: [
            { user: "Yichao Xu2", time: "2021-03-31 19:00", contents: "赞同" },
            { user: "Yichao Xu3", time: "2021-03-31 20:00", contents: "+1" },
          ],
          pic_src: ["1.jpg", "2.jpg"],
        },
      ],
    };
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
            {this.state.moments.map((item, index) => (
              <MomentCard key={index} moment={item} />
            ))}
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

import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { CircularProgress, Grid } from "@material-ui/core";
import { connect } from "react-redux";
import axios from "../../helpers/axiosConfig";
import Divider from "@material-ui/core/Divider";
import withStyles from "@material-ui/core/styles/withStyles";
import ViewNav from "./ViewNav";
import { fetchViewExperiences } from "../../actions/viewAction";
import Alert from "@material-ui/lab/Alert";

const styles = (theme) => ({
  root: {
    backgroundColor: "#094183",
    paddingBottom: "0px",
    color: "#fff",
  },
  body: {
    width: "100%",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "100%",
  },
  formTitle: {
    marginBottom: "1rem",
    textAlign: "center",
    fontFamily: "Nunito, sans-serif",
  },
  formWrap: {
    padding: "64px 32px",
  },
  NunitoFont: {
    fontFamily: "Nunito, sans-serif",
  },
  form: {
    width: "100%",
  },
  form_group: {
    padding: "5px 5px 5px 5px",
  },
});

class MyAccordion extends Component {
  render() {
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6">{this.props.position}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="column">
            <Grid Item>
              <Typography variant="subtitle1">
                {this.props.start_date &&
                  this.props.start_date.substring(0, 10)}{" "}
                - {this.props.end_date.substring(0, 10)}
              </Typography>
            </Grid>
            <Grid Item>
              <Typography variant="subtitle1">{this.props.company}</Typography>
            </Grid>
            <Grid Item>
              <Typography>{this.props.description}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
        <Divider />
      </Accordion>
    );
  }
}
const DisplayItems = (items) => {
  let current = [];
  let past = [];
  let i = 0;
  let j = 0;
  items.forEach((item) => {
    if (item.props.state === "going") {
      current[i] = item;
      i++;
    } else {
      past[j] = item;
      j++;
    }
  });
  return (
    <div>
      <Typography variant="h3">Current Experience</Typography>
      <br />
      {current}
      <br />
      <Typography variant="h3">Past Experience</Typography>
      <br />
      {past}
    </div>
  );
};

class ViewExperience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view_user: "default",
    };
  }

  componentDidMount() {
    const user_id = this.props.match.params.id;

    axios.get(`/view/${user_id}`).then((res) => {
      this.setState({ view_user: res.data });
    });
    this.props.dispatch(fetchViewExperiences(user_id));
  }

  render() {
    console.log(this.props);
    let content;
    const { error, isFetching, view_experiences } = this.props.view;

    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
      //show the circular progress bar if database is still process
      content = (
        <Grid container justify="center" alignItems="center">
          <CircularProgress color="primary" />
        </Grid>
      );
    } else if (!view_experiences) {
      content = (
        <Grid container justify="center" alignItems="center">
          <Typography>No experience found</Typography>
        </Grid>
      );
    } else {
      let experienceArray = {};
      let i = 0;
      let experienceObj = view_experiences.map((item) => {
        experienceArray[i] = {};
        Object.entries(item).map(([key, value]) => {
          experienceArray[i][key] = value;
          return undefined;
        });
        return (
          <MyAccordion
            _id={experienceArray[i]._id}
            key={experienceArray[i]._id}
            position={experienceArray[i].position}
            description={experienceArray[i].description}
            start_date={experienceArray[i].start_date}
            state={experienceArray[i].state}
            company={experienceArray[i].company}
            end_date={experienceArray[i++].end_date}
            update={this.update}
            delete={this.deleteExperience}
            edit={this.editExperience}
          />
        );
      });
      content = DisplayItems(experienceObj);
    }
    return (
      <Fragment>
        <ViewNav view_user={this.state.view_user} />
        <Helmet>
          <title>Microhard &middot; Experience </title>
        </Helmet>
        <div style={{ height: "120px", backgroundColor: "#094183" }}>
          <br />
          <br />
          <Typography
            variant="h1"
            align="center"
            style={{ color: "#fff", fontSize: "36px" }}
          >
            Career Experience
          </Typography>
        </div>
        <br />
        <br />
        <Grid container justify="center" direction="row" spacing="3">
          <Grid item xs={12} sm={9}>
            {content}
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(withStyles(styles)(ViewExperience));

import React, { Component, Fragment, useState } from "react";
import { Helmet } from "react-helmet";
import { withStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { CircularProgress, Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Formik, Field, Form } from "formik";

import Divider from "@material-ui/core/Divider";
import AccordionActions from "@material-ui/core/AccordionActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { fullWidth } from "validator/es/lib/isFullWidth";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

import {
  editExperience,
  postExperience,
  fetchExperiences,
  deleteExperience,
} from "../../actions/experienceAction";
import { connect } from "react-redux";
import Alert from "@material-ui/lab/Alert";

const useStyles2 = (theme) => ({
  root: {
    backgroundColor: "#094183",
    paddingBottom: "0px",
    color: "#fff",
  },
  progress: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

//Form used to create and edit experiences
function MyForm(props) {
  //Set initial values for values that need to be parsed differently if undefined
  let initialState = "going";
  if (props.state !== undefined) {
    initialState = props.state;
  }
  let initialStartDate = "";
  if (props.start_date !== undefined) {
    initialStartDate = props.start_date.substring(0, 10);
  }
  let initialEndDate = "";
  if (props.end_date !== undefined) {
    initialEndDate = props.end_date.substring(0, 10);
  }
  return (
    <Dialog
      fullWidth={fullWidth}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.open}
      onClose={props.handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <DialogContent>
          <div>
            <h2 id="transition-modal-title">{props.title}</h2>
            <Formik
              initialValues={{
                start_date: initialStartDate,
                end_date: initialEndDate,
                position: props.position,
                company: props.company,
                description: props.description,
                state: initialState,
              }}
              onSubmit={(values) => {
                props.submit(values);
                props.handleClose();
              }}
            >
              <Form width="100%">
                <Typography variant="body2">
                  <br />
                </Typography>
                <Field
                  as={TextField}
                  type="date"
                  id="start_date"
                  name="start_date"
                  label="Start date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
                <Typography variant="body2">
                  <br />
                </Typography>
                <Field
                  as={TextField}
                  label="End Date"
                  name="end_date"
                  id="end_date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
                <Typography variant="body2">
                  <br />
                </Typography>
                <Field
                  as={TextField}
                  label="Position"
                  name="position"
                  id="position"
                  fullWidth
                />
                <Typography variant="body2">
                  <br />
                </Typography>
                <Field
                  as={TextField}
                  label="Company"
                  name="company"
                  id="company"
                  fullWidth
                />
                <Typography variant="body2">
                  <br />
                </Typography>
                <Field
                  as={TextField}
                  label="Description"
                  name="description"
                  id="description"
                  fullWidth
                  multiline
                />
                <Typography variant="body2">
                  <br />
                </Typography>
                <Field as={RadioButton} label="state" name="state" id="state" />
                <Button
                  type="submit"
                  variant="raised"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Form>
            </Formik>
          </div>
        </DialogContent>
      </Fade>
    </Dialog>
  );
}

//Specialised button used in MyForm
const RadioButton = ({ field, ...props }) => {
  return (
    <RadioGroup
      {...field}
      {...props}
      label={props.label}
      name={props.name}
      defaultValue={props.state}
    >
      <FormLabel component="legend">Do you currently work here?</FormLabel>
      <FormControlLabel value="going" control={<Radio />} label="Yes" />
      <FormControlLabel value="end" control={<Radio />} label="No" />
    </RadioGroup>
  );
};

//Button used in accordions to edit experiences
function EditButton(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleAccept = (values) => {
    props.edit(props._id, values);
    setTimeout(() => props.update(), 400);
    setOpen(false);
  };

  return (
    <div>
      <Button size="small" onClick={handleClickOpen}>
        Edit
      </Button>
      <MyForm
        {...props}
        open={open}
        handleClose={handleClose}
        title="Edit This Experience"
        submit={handleAccept}
      />
    </div>
  );
}

//Button used in accordions to delete experiences
function DeleteButton(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleAccept = () => {
    props.delete(props._id);
    setTimeout(() => props.update(), 400);
    setOpen(false);
  };

  return (
    <div>
      <Button size="small" color="primary" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Accepting this will permanently remove this experience from your
            profile.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAccept} color="primary" autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

//Component used to display individual experiences
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
        <AccordionActions>
          <EditButton {...this.props} />
          <div>
            <DeleteButton {...this.props} />
          </div>
        </AccordionActions>
      </Accordion>
    );
  }
}

//Method used to display experiences based on state: past or present
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

//Main class used for experience page
class Experience extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.createExperience = this.createExperience.bind(this);
    this.deleteExperience = this.deleteExperience.bind(this);
    this.editExperience = this.editExperience.bind(this);
    this.update = this.update.bind(this);
    this.state = {
      open: null,
    };
  }

  handleClick() {
    this.setState({ open: true });
  }
  handleClose() {
    this.setState({ open: false });
  }

  createExperience(values) {
    this.props.dispatch(postExperience(values));
  }

  deleteExperience(_id) {
    this.props.dispatch(deleteExperience(_id));
  }

  update() {
    this.props.dispatch(fetchExperiences());
  }

  componentDidMount() {
    this.props.dispatch(fetchExperiences());
  }

  editExperience(_id, values) {
    this.props.dispatch(editExperience(_id, values));
  }

  render() {
    const { classes } = this.props;
    let content;
    const { error, isFetching, experiences } = this.props.experience;

    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
      //show the circular progress bar if database is still process
      content = (
        <Grid container justify="center" alignItems="center">
          <CircularProgress color="primary" />
        </Grid>
      );
    } else if (!experiences) {
      content = (
        <Grid container justify="center" alignItems="center">
          <Typography>No experience found</Typography>
        </Grid>
      );
    } else {
      let experienceArray = {};
      let i = 0;
      let experienceObj = experiences.map((item) => {
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
        <Helmet>
          <title>Microhard &middot; Experience </title>
        </Helmet>

        <div style={{ height: "120px", backgroundColor: "#094183" }}>
          <br />
          <br />
          <Typography variant="h1" align="center" style={{ color: "#fff" }}>
            Career Experience
          </Typography>
        </div>
        <br />
        <br />
        <Grid container justify="center" direction="row" spacing="3">
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleClick}
            >
              Add new Experience
            </Button>
          </Grid>
          <MyForm
            open={this.state.open}
            update={this.update}
            classes={classes}
            handleClose={this.handleClose}
            title="Add New Experience"
            submit={this.createExperience}
          />
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

export default connect(mapStateToProps)(withStyles(useStyles2)(Experience));

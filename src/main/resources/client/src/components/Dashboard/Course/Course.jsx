import React, {Component, Fragment, useState} from 'react';
import {Helmet} from 'react-helmet';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {CircularProgress, Grid, TableContainer, Typography} from '@material-ui/core';
import {Field, Form, Formik} from 'formik';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import Dialog from '@material-ui/core/Dialog';
import {fullWidth} from 'validator/es/lib/isFullWidth';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import DialogContent from '@material-ui/core/DialogContent';
import MenuItem from '@material-ui/core/MenuItem';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import {editCourse, postCourse, fetchCourses, deleteCourse} from '../../../actions/courseAction';
import Alert from '@material-ui/lab/Alert';

const useStyles = (theme) => ({
  root: {
    backgroundColor: '#094183',
    paddingBottom: '0px',
    color: '#fff',
  },
  formTitle: {
    marginBottom: '1rem',
    textAlign: 'center',
    fontFamily: 'Nunito, sans-serif',
  },
  formWrap: {
    padding: '64px 32px',
  },
});

//Display course information in grid by year and semester
function MyGrid(props) {
  let keys = Object.keys(props.courses);
  let i = 0;
  let color;

  let gridByYear = keys.map((key) => {
    let summer = [],
      winter = [],
      sem1 = [],
      sem2 = [];
    {
      props.courses[key].map((value) => {
        switch (value.sem) {
          case 'Sem1':
            sem1.push(value.code + '\n');
            break;
          case 'Sem2':
            sem2.push(value.code + '\n');
            break;
          case 'Winter':
            winter.push(value.code + '\n');
            break;
          case 'Summer':
            summer.push(value.code + '\n');
            break;
        }
      });
    }
    if (i === 0) {
      color = '#88B9EB';
      i = 1;
    } else {
      color = '#ffff';
      i = 0;
    }
    return (
      <div>
        <Grid
          container
          style={{backgroundColor: color}}
          spacing={2}
          justify="space-evenly"
          alignItems="center"
        >
          <Grid item sm={1}>
            <Typography
              align="right"
              style={{fontFamily: 'sans-serif', fontSize: 22}}
            >
              {key}
            </Typography>
            <br />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item sm={2}>
            <Typography align="center" variant="h5">
              {summer}
            </Typography>
            <br />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item sm={2}>
            <Typography align="center" variant="h5">
              {sem1}
            </Typography>
            <br />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item sm={2}>
            <Typography align="center" variant="h5">
              {winter}
            </Typography>
            <br />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item sm={2}>
            <Typography align="center" variant="h5">
              {sem2}
            </Typography>
            <br />
          </Grid>
        </Grid>
      </div>
    );
  });

  return (
    <div>
      <br />
      <br />
      <Grid container spacing={2} justify="space-evenly">
        <Grid item sm={1}>
          <br />
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item sm={2}>
          <Typography
            align="center"
            style={{fontFamily: 'sans-serif', fontSize: 22}}
          >
            Summer
          </Typography>
          <br />
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item sm={2}>
          <Typography
            align="center"
            style={{fontFamily: 'sans-serif', fontSize: 22}}
          >
            Semester 1
          </Typography>
          <br />
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item sm={2}>
          <Typography
            align="center"
            style={{fontFamily: 'sans-serif', fontSize: 22}}
          >
            Winter
          </Typography>
          <br />
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item sm={2}>
          <Typography
            align="center"
            style={{fontFamily: 'sans-serif', fontSize: 22}}
          >
            Semester 2
          </Typography>
          <br />
        </Grid>
      </Grid>
      {gridByYear}
      <br />
    </div>
  );
}

//component to display course information
class MyAccordion extends Component {
  render() {
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6">{this.props.code}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="column">
            <Grid Item>
              <Typography variant="subtitle1">{this.props.name}</Typography>
            </Grid>
            <Grid Item>
              <Typography variant="subtitle1">
                {this.props.description}
              </Typography>
            </Grid>
            <Grid Item>
              <Typography>{this.props.link}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
        <Divider />
      </Accordion>
    );
  }
}

//maps all courses to accordions
function GetAccords(props) {
  let accords = props.courses.map((elem) => {
    return (
      <div>
        <MyAccordion
          code={elem.code}
          name={elem.name}
          description={elem.description}
          link={elem.link}
        />
      </div>
    );
  });
  return <div>{accords}</div>;
}

//function to display courses in a list
function GetList(props) {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="my-table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Code</TableCell>
              <TableCell align="center">Subject Level</TableCell>
              <TableCell align="center">Year Taken</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Grade</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.courses.map((row) => (
              <TableRow key={row.name}>
                <TableCell align="center">{row.code}</TableCell>
                <TableCell align="center">{row.score}</TableCell>
                <TableCell align="center">{row.year}</TableCell>
                <TableCell align="center">{row.state}</TableCell>
                <TableCell align="center">{row.grades}</TableCell>
                <TableCell align="center">
                  <EditButton {...row} {...props} />
                  <DeleteButton
                    {...row}
                    {...props}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

//form used to edit or create new courses
function MyForm(props) {
  let semesters = [
    {value: 'Sem1', label: 'Semester 1'},
    {value: 'Winter', label: 'Winter'},
    {value: 'Sem2', label: 'Semester 2'},
    {value: 'Summer', label: 'Summer'},
  ];
  let states = [
    {value: 'Finished', label: 'Finished'},
    {value: 'OnGoing', label: 'On Going'},
    {value: 'Planned', label: 'Planned'},
  ];
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
                code: props.code,
                year: props.year,
                score: props.score,
                grades: props.grades,
                description: props.description,
                state: props.state,
                name: props.name,
                sem: props.sem,
                link: props.link,
              }}
              onSubmit={(values) => {
                props.submit(values);
                props.handleClose();
                //setTimeout(() => props.refresh(), 400);
                setTimeout(() => props.update(), 400);
              }}
            >
              <Form width="100%">
                <Typography variant="body2">
                  <br />
                </Typography>
                <Field
                  as={TextField}
                  id="code"
                  name="code"
                  label="Subject Code"
                  fullWidth
                  required
                />
                <Typography variant="body2">
                  <br />
                </Typography>
                <Field
                  as={TextField}
                  label="Subject Title"
                  name="name"
                  id="name"
                  fullWidth
                />
                <Typography variant="body2">
                  <br />
                </Typography>
                <Field
                  as={TextField}
                  label="Course Description"
                  name="description"
                  id="description"
                  fullWidth
                  multiline
                />
                <Typography variant="body2">
                  <br />
                </Typography>
                <Field
                  as={TextField}
                  label="Semester Taken"
                  name="sem"
                  id="sem"
                  fullWidth
                  select
                >
                  {semesters.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>

                <Typography variant="body2">
                  <br />
                </Typography>
                <Field
                  as={TextField}
                  label="State of Subject"
                  name="state"
                  id="state"
                  select
                  fullWidth
                >
                  {states.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
                <Typography variant="body2">
                  <br />
                </Typography>

                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  spacing={1}
                >
                  <Grid item xs={4}>
                    <Field
                      as={TextField}
                      label="Year Taken"
                      name="year"
                      id="year"
                      type="number"
                      InputProps={{inputProps: {min: 1853, max: 2500}}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Field
                      as={TextField}
                      label="Subject level"
                      name="score"
                      id="score"
                      type="number"
                      InputProps={{inputProps: {min: 0, max: 4}}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Field
                      as={TextField}
                      label="Grade"
                      name="grades"
                      id="grades"
                      type="number"
                      InputProps={{inputProps: {min: 0, max: 100}}}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Typography variant="body2">
                  <br />
                </Typography>
                <Field
                  as={TextField}
                  label="Link to handbook"
                  name="link"
                  id="link"
                  fullWidth
                />
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

//Button used in GetList to open the form and edit a course
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
    setOpen(false);
    setTimeout(() => props.update(), 400);
  }
  return (
    <div>
      <Button size="small" onClick={handleClickOpen}>
        Edit
      </Button>
      <MyForm
        open={open}
        handleClose={handleClose}
        title="Edit This Course"
        submit={handleAccept}
        {...props}
      />
    </div>
  );
}

//Button used in GetList to open the form and delete a course
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
    setOpen(false);
    setTimeout(() => props.update(), 400);
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
            Accepting this will permanently remove this course from your
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

//Main class to display the course page
class Course extends Component {
  constructor(props) {
    super(props);
    this.createCourse = this.createCourse.bind(this);
    this.updateCourse = this.updateCourse.bind(this);
    this.deleteCourse = this.deleteCourse.bind(this);
    this.update = this.update.bind(this);
    this.state = {
      tabIndex: 0,
      open: null,
    };
  }

  createCourse(values) {
    this.props.dispatch(postCourse(values));
  }
  updateCourse(_id, values) {
    this.props.dispatch(editCourse(_id, values))
  }
  update() {
    this.props.dispatch(fetchCourses());
  }
  deleteCourse(_id) {
    this.props.dispatch(deleteCourse(_id))
  }
  componentDidMount() {
    this.props.dispatch(fetchCourses());
  }
  render() {
    const {classes} = this.props;
    let overviewContent;
    let detailsContent;

    const {error, isFetching, courses} = this.props.course;

    if (isFetching) {
      //show the circular progress bar if database is still process
      overviewContent = (
        <div>
        <br/>
        <Grid container justify="center" alignItems="center">
          <CircularProgress className={classes.progress}/>
        </Grid>
        </div>
      );
      detailsContent = (
        <div>
          <br/>
          <Grid container justify="center" alignItems="center">
            <CircularProgress className={classes.progress}/>
          </Grid>
        </div>
      );
    } else if (!courses) {
      overviewContent = (
        <Grid container justify="center" alignItems="center">
          <Typography>
            No courses found
          </Typography>
        </Grid>
      );
      detailsContent = (
        <Grid container justify="center" alignItems="center">
          <Typography>
            No courses found
          </Typography>
        </Grid>
      );
    } else if (courses.course) {
      //retrieved courses, parse data
      let rows = [];
      let i = 0;

      Object.values(courses.course).map((yearArray) => {
        yearArray.forEach((item) => {
          rows[i] = {};
          rows[i] = {
            code: item.code,
            year: item.year,
            sem: item.sem,
            grades: item.grades,
            score: item.score,
            state: item.state,
            description: item.description,
            name: item.name,
            link: item.link,
            _id: item._id,
          };
          i++;
        })
      });
      //display data in each tab
      detailsContent = <GetList courses={rows} edit={this.updateCourse}
                                update={this.update} delete={this.deleteCourse} />;
      overviewContent =
        <div>
          <MyGrid courses={courses.course}/>
          <br />
          <Typography align="center" variant="h3">
            Course Overview
          </Typography>
          <br />
          <Grid container justify="center" direction="row">
            <Grid item xs={11}>
              <GetAccords courses={rows} />
            </Grid>
          </Grid>
        </div>;
    }

    return (
      <Fragment>
        <Helmet>
          <title>Microhard &middot; Courses </title>
        </Helmet>
        <div style={{height: '120px', backgroundColor: '#094183'}}>
          <br />
          <br />
          <Typography variant="h1" align="center" style={{color: '#fff'}}>
            Courses
          </Typography>
        </div>
        <div>
          <Tabs
            value={this.state.tabIndex}
            onChange={(e, index) => this.setState({tabIndex: index})}
            variant="fullWidth"
            indicatorColor="secondary"
            textColor="secondary"
            aria-label="icon label tabs example"
          >
            <Tab label="Overview" index={0} />
            <Tab label="Details" index={1} />
          </Tabs>
          {this.state.tabIndex === 0 && (
            <div>
              {overviewContent}
            </div>
          )}
          {this.state.tabIndex === 1 && (
            <div>
              {detailsContent}
              <br />
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => this.setState({open: true})}
              >
                Add new Course
              </Button>
              <MyForm
                open={this.state.open}
                classes={classes}
                handleClose={() => this.setState({open: null})}
                title="Add New Course"
                submit={this.createCourse}
                year="2020"
                sem="Winter"
                update={this.update}
              />
            </div>
          )}
          <br />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(withStyles(useStyles)(Course));

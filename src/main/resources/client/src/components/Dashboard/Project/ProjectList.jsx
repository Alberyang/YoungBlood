import React, {Component, Fragment, useState} from 'react';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import {withStyles} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/core/styles';
import {Formik, Field, Form} from 'formik';
import Alert from '@material-ui/lab/Alert';
import {CircularProgress} from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import AccordionSummary from '@material-ui/core/AccordionSummary';
import Accordion from '@material-ui/core/Accordion';
import AccordionActions from '@material-ui/core/AccordionActions';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import {IconButton} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';

import {
  fetchProjectListCondition,
  deleteProject,
  createProject,
} from '../../../actions/projectAction';

const styles = (theme) => ({
});

const useStyles = makeStyles((theme) => ({
  textfield :{
    marginBottom: theme.spacing(2),
  }
}));

//button to opening warning delete form
function DeleteButton(props) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //when click delete project
  const handleDelete = () => {
    setOpen(false);
    props.delete(props.id);
  };
  return (
    <Fragment>
      <Button color="primary" size="small" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? The project will be
            permanently delete and unable to recover.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

//Button opening add form
function AddButton(props) {
  const [open, setOpen] = useState(false);

  //when click open form add
  const handleClickOpen = () => {
    setOpen(true);
  };

  //when click close
  const handleClose = () => {
    setOpen(false);
  };

  //when submit to create new project
  const onSubmit = (values) => {
    props.add(values);
  };
  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <AddBoxIcon color="primary" />
      </IconButton>
      <MyForm
        open={open}
        handleClose={handleClose}
        title="Add a project"
        submit={onSubmit}
      />
    </div>
  );
}

//adding form with name and description
function MyForm(props) {
  const classes = useStyles();
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      closeAfterTransition
    >
        <DialogContent>
          <div>
            <Formik
              initialValues={{
                name: "",
                description: "",
              }}
              onSubmit = {(values) => {props.submit(values); props.handleClose();}}
            >
              <Form width='100%'>
                <Typography fullwidth align="center" className={classes.textfield}>
                  ADD NEW PROJECT
                </Typography>
                <Field as={TextField}
                  label="Name"
                  variant="outlined"
                  name="name"
                  id="name"
                  className={classes.textfield}
                  fullWidth
                  required
                />
                <Field as={TextField}
                  label="Description"
                  variant="outlined"
                  name="description"
                  id="description"
                  className={classes.textfield}
                  fullWidth
                />
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                  className={classes.textfield}
                >
                  Submit
                </Button>
              </Form>
            </Formik>
          </div>
        </DialogContent>
    </Dialog>
  );
}

//this will render each project in the project list
function Project(props){
  return(
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6">{props.project.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column">
          <Typography>Description: {props.project.description}</Typography>
          <Typography>Progress: {props.project.status}</Typography>
          <Typography>Show status: {props.project.show_status}</Typography>
        </Grid>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button color="primary" size="small" href={"/project/view/"+props.project._id}>
          View
        </Button>
        <Button color="primary" size="small" href={"/project/"+props.project._id}>
          Edit
        </Button>
        <DeleteButton
          id={props.project._id}
          delete={(id) => props.delete(id)}
        />
      </AccordionActions>
    </Accordion>
  );
}

//main class: initiate and using all the function above
class ProjectList extends Component{
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
    this.getCondition = this.getCondition.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onShowStatusChange = this.onShowStatusChange.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.state = {
      search: '',
      search_status: '',
      sortBy: '',
      show_status: '',
    };
  }

  //this function will handle create a project
  onFormSubmit = (value) => {
    console.log(value);
    this.props.dispatch(createProject(value));
  };

  //this function handle delete a project
  deleteProject = (id) => {
    this.props.dispatch(deleteProject(id));
  };

  //fetch data using condition save
  getCondition = () =>{
    let formD = {"name": this.state.input}
    if(this.state.search_status !== ""){
      formD['status'] = this.state.search_status;
    }
    if (this.state.sortBy !== '') {
      formD['sortBy'] = this.state.sortBy;
    }
    if (this.state.show_status !== '') {
      formD['show_status'] = this.state.show_status;
    }
    this.props.dispatch(fetchProjectListCondition(formD));
  };

  //fetch data when component first mount
	componentDidMount = () => {
    this.getCondition();
  };

  //functions below just handle input from user on utility lines
  onChangeInput = (event) => {
    this.setState({input: event.target.value});
  };

  onSearch = (event) => {
    if (event.key === 'Enter') {
      this.getCondition();
    }
  };

  onStatusChange = (event, newstatus) => {
    if (newstatus !== null) {
      this.setState({search_status: newstatus}, this.getCondition);
    }
  };

  onSortChange = (event, newsort) => {
    if (newsort !== null) {
      this.setState({sortBy: newsort}, this.getCondition);
    }
  };

  onShowStatusChange = (event, newshow) => {
    if (newshow !== null) {
      this.setState({show_status: newshow}, this.getCondition);
    }
  };

  render() {
    const {error, isFetching, projects} = this.props.project;

    let content;
    //if there is issues with fetching
    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
      //if the fetch from the database have not arrive
      content = (
        <Grid container justify="center" alignItems="center">
          <CircularProgress color="primary" />
        </Grid>
      );
    } else if (projects.length === 0 || !projects) {
      //if the data receive undefined or the project is empty
      content = (
        <Grid container justify="center" alignItems="center">
          <Typography> No projects found.</Typography>
        </Grid>
      );
    } else {
      //map out all the project that fetched from databased
      content = projects.map((proj) => (
        <Project key={proj._id} project={proj} delete={this.deleteProject}/>
      ));
    }
    return (
      <Fragment>
      <Helmet>
        <title>Microhard &middot; My projects </title>
      </Helmet>

      {/* hero content */}
      <div style={{height: '120px', backgroundColor: '#094183'}}>
        <br />
        <br />
        <Typography variant="h1" align="center" style={{color: '#fff'}}>
          Project Lists
        </Typography>
      </div>
      <br/>

      {/* body content */}
      <Container maxWidth="md">

        {/* utility lines - each grid is a line */}
        <Grid container direction="row" justify="space-between" alignItems="center">

          {/* search bar */}
          <TextField
            onChange ={this.onChangeInput}
            onKeyDown={this.onSearch}
            value={this.state.input}
            variant="outlined"
            size="small"
            label="Search name"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon/>
                </InputAdornment>
              )
            }}
          />

          {/* sorting based on time update */}
          <ToggleButtonGroup
            value={this.state.sortBy}
            exclusive
            onChange={this.onSortChange}
            size="small"
          >
            <ToggleButton value="">All</ToggleButton>
            <ToggleButton value='descending'>Oldest</ToggleButton>
            <ToggleButton value='ascending'>Lastest</ToggleButton>
          </ToggleButtonGroup>

          {/* sorting based on progress status */}
          <ToggleButtonGroup
            value={this.state.search_status}
            exclusive
            onChange={this.onStatusChange}
            size="small"
          >
            <ToggleButton value="">All</ToggleButton>
            <ToggleButton value='Inprogress'>In Progress</ToggleButton>
            <ToggleButton value='Completed'>Complete</ToggleButton>
            <ToggleButton value='Cancel'>Cancel</ToggleButton>
          </ToggleButtonGroup>

          {/* sorting based on show status */}
          <ToggleButtonGroup
            value={this.state.show_status}
            exclusive
            onChange={this.onShowStatusChange}
            size="small"
          >
            <ToggleButton value="">All</ToggleButton>
            <ToggleButton value='public'>Public</ToggleButton>
            <ToggleButton value='private'>Private</ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid container direction="row" alignItems="center">
          {/* Add button */}
          <AddButton add={this.onFormSubmit}/>
        </Grid>
        <br/>

        {/* Listing content */}
        {content}
        <br/>
        <br/>
      </Container>
    </Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(withStyles(styles)(ProjectList));

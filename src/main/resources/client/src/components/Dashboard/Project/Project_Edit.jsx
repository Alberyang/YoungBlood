import React, {Fragment, Component} from 'react';
import {Helmet} from 'react-helmet';
import {withStyles } from '@material-ui/core/styles';
import {withRouter} from "react-router";
import {connect} from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import {CircularProgress} from '@material-ui/core';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import ListIcon from '@material-ui/icons/List';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';

import General from './General';
import Status from './Status';
import Contributor from './Contributors';
import Process from './Process';
import Timeline from './Timeline';

import {fetchProject} from '../../../actions/projectAction';

const styles = (theme) => ({
  cardGrid: {
      paddingTop: theme.spacing(4),
  },
  card: {
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
  },
  cardContent: {
      flexGrow: 0,
  },
  body: {
    backgroundImage:
      'linear-gradient(to top, #094183 0%, #5FA5E1 100%, #CAE8FA 100%)',
    padding: theme.spacing(6, 0, 6),
  },
  progress: {
    marginTop: theme.spacing(2),
    marginBottom:theme.spacing(2),
    color: "white",
  },
  root: {
      width: "100%",
  }
});

class Project extends Component{
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  //fetch data from database when first mount
  componentDidMount = () =>{
    let id = null;
    if (this.props.match.params.id !== undefined) {
      id = this.props.match.params.id;
    }
    this.props.dispatch(fetchProject(id));
  }

  render(){
    const {classes} = this.props;
    const id = this.props.match.params.id;
    let content;
    const {error, isFetching, project} = this.props.project;
    if (error) {
      //if fetch have some error
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
      //if data from database havent arrived
      //show progress bar
      content = (
        <Grid container justify="center" alignItems="center" className={classes.root}>
          <CircularProgress className={classes.progress}/>
        </Grid>
      );
    } else if (!project) {
      //if the project is undefined
      content = (
        <Grid container justify="center" alignItems="center">
          <Typography> Cannot found the project requested.</Typography>
        </Grid>
      );
    } else {
      //if fetch arrive and succesfully fetch the project
      //render out content of project
      content = (
        <Container maxWidth="md" className={classes.cardGrid}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <General id={id}/>
                </CardContent>
              </Card>
              <br/>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Process id={id}/>
                </CardContent>
              </Card>
              <br/>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Timeline id={id}/>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Status id={id}/>
                </CardContent>
              </Card>
              <br/>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Contributor id={id}/>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      );
    }
    return (
      <Fragment>
        <Helmet>
          <title>Microhard &middot; Project</title>
        </Helmet>

        {/* main content */}
        <div className={classes.body}>

          {/* hero content */}
          <Container maxWidth="sm" >
            <Typography variant="h1" component="h2" align="center" style={{color: '#fff'}} gutterBottom>
              EDITING PAGE
            </Typography>
            <br/>
            <Grid container spacing={4} justify="center" alignItems="center">
              <Grid item>
                <Button variant="contained" href={"/project/"} endIcon={<ListIcon/>}>
                  Back to List
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" href={"/project/view/"+id} endIcon={<ImportContactsIcon/>}>
                  View page
                </Button>
              </Grid>
            </Grid>
          </Container>
          <br/>

          {/* project content */}
          {content}

        </div>
      </Fragment>
  );}
}

const mapStateToProps = (state) => ({
  ...state,
});
export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(Project))
);

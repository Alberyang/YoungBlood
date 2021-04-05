import React, {Fragment, Component, useState} from 'react';
import {Helmet} from 'react-helmet';
import {withRouter} from 'react-router';
import {withStyles} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {CircularProgress} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';

import Divider from '@material-ui/core/Divider';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Collapse from '@material-ui/core/Collapse';
import ListIcon from '@material-ui/icons/List';
import EditIcon from '@material-ui/icons/Edit';

import {fetchProject} from '../../../actions/projectAction';

//this is css for fucntion
const useStyles = makeStyles((theme) => ({
  item: {
    marginLeft: 8,
  },
  icon: {
    marginRight: 12,
  },
}));

//this is css for export class
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
  oppositeContent: {
    flex: 0,
    padding: 0,
  },
  body: {
    backgroundImage:
      'linear-gradient(to top, #094183 0%, #5FA5E1 100%, #CAE8FA 100%)',
    padding: theme.spacing(6, 0, 6),
  },
  text: {
    marginTop: theme.spacing(1),
  },
  progress: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: 'white',
  },
  root: {
    width: '100%',
  },
});

//this render the process section in main part
function Process(props) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <List>
      <ListItem button onClick={handleClick}>
        <ListItemText>
          {props.proc.processNum}: {props.proc.description}
        </ListItemText>
        {!open ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List>
          {props.proc.nodes && props.proc.nodes.length > 0 ? (
            props.proc.nodes.map((node) => {
              return (
                <Fragment key={node.index}>
                  {!node.state ? (
                    <ListItem className={classes.item}>
                      <ListItemText primary={node.description} />
                    </ListItem>
                  ) : (
                    <ListItem disabled className={classes.item}>
                      <ListItemText primary={node.description} />
                      <DoneAllIcon className={classes.icon} />
                    </ListItem>
                  )}
                </Fragment>
              );
            })
          ) : (
            <ListItem className={classes.icon}>
              <ListItemText>No task yet</ListItemText>
            </ListItem>
          )}
        </List>
      </Collapse>
      <Divider />
    </List>
  );
}

//this is the main part of the page
//render all except the navigation
class Project_View extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  //fetch project from database when the page first load
  componentDidMount = () => {
    let id = null;
    if (this.props.match.params.id !== undefined) {
      id = this.props.match.params.id;
    }
    this.props.dispatch(fetchProject(id));
  };

  render() {
    const {classes} = this.props;
    const id = this.props.match.params.id;

    //this will decided the content based on the result after fetching data from database
    let content;
    const {error, isFetching, project} = this.props.project;
    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
      //show the circular progress bar if databased still process
      content = (
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.root}
        >
          <CircularProgress color="primary" className={classes.progress} />
        </Grid>
      );
    } else if (!project) {
      //response if the project list is empty
      content = (
        <Grid container justify="center" alignItems="center">
          <Typography>Cannot found the project requested.</Typography>
        </Grid>
      );
    } else {
      //render all project fetched
      content = (
        <Grid container spacing={3}>
          {/* left side collumn */}
          <Grid item xs={12} md={8}>
            {/* 1st card: project description */}
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Description
                </Typography>
                <Divider />
                {project.description && project.description !== '' ? (
                  <Typography className={classes.text}>
                    {project.description}
                  </Typography>
                ) : (
                  <Typography className={classes.text}>
                    No Description Yet
                  </Typography>
                )}
              </CardContent>
            </Card>
            <br />

            {/* 2nd card: project process*/}
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Process
                </Typography>
                <Divider />
                {project.process && project.process.length > 0 ? (
                  project.process.map((proc) => {
                    return <Process proc={proc} key={proc.processNum} />;
                  })
                ) : (
                  <Typography className={classes.text}>
                    No Process Yet
                  </Typography>
                )}
              </CardContent>
            </Card>
            <br />

            {/* 3rd card: project timeline*/}
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Timeline
                </Typography>
                <Divider />
                {project.timeline && project.timeline.length > 0 ? (
                  <Timeline>
                    {project.timeline.map((each) => {
                      return (
                        <TimelineItem key={each.index} align="left">
                          <TimelineSeparator>
                            <TimelineDot color="primary" />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineOppositeContent
                            className={classes.oppositeContent}
                          />
                          <TimelineContent>
                            <Card>
                              <CardContent>
                                <Typography>
                                  {each.time.slice(0, 10)}
                                </Typography>
                                <Divider />
                                <Typography>{each.description}</Typography>
                              </CardContent>
                            </Card>
                          </TimelineContent>
                        </TimelineItem>
                      );
                    })}
                  </Timeline>
                ) : (
                  <Typography className={classes.text}>
                    No Timeline Yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* right sided column*/}
          <Grid item xs={12} md={4}>
            {/* 1st card: project status*/}
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Status
                </Typography>
                <Divider />
                <Typography className={classes.text}>
                  Progress Status: {project.status}
                </Typography>
                <Typography>Show Status: {project.show_status}</Typography>
              </CardContent>
            </Card>
            <br />

            {/* 2nd card: project rating*/}
            {/*<Card className={classes.card}>*/}
            {/*  <CardContent className={classes.cardContent}>*/}
            {/*    <Typography gutterBottom variant="h5" component="h2">Rating</Typography>*/}
            {/*    <Divider/>*/}
            {/*    <Typography className={classes.text}>{project.rating}{" "} likes</Typography>*/}
            {/*  </CardContent>*/}
            {/*</Card>*/}
            {/*<br/>*/}

            {/* 2nd card: project contributor*/}
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Contributor
                </Typography>
                <Divider />
                <List>
                  {project.contributors &&
                    project.contributors.map((con, i) => {
                      return <ListItemText key={i}>{con}</ListItemText>;
                    })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    }
    return (
      <Fragment>
        <Helmet>
          <title>Microhard &middot; Project View</title>
        </Helmet>
        <div className={classes.body}>
          {/* page hero content*/}
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              style={{color: '#fff'}}
              gutterBottom
            >
              {project.name}
            </Typography>
            <br />
            <Grid container spacing={4} justify="center" alignItems="center">
              <Grid item>
                <Button
                  variant="contained"
                  href={'/project/'}
                  endIcon={<ListIcon />}
                >
                  Back to List
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  href={'/project/' + id}
                  endIcon={<EditIcon />}
                >
                  Edit Page
                </Button>
              </Grid>
            </Grid>
          </Container>

          {/* project detail*/}
          <Container className={classes.cardGrid} maxWidth="md">
            {content}
          </Container>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});
export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(Project_View))
);

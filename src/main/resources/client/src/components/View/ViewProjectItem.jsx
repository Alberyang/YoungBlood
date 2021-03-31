import React, {Fragment, Component, useState} from 'react';
import {Helmet} from 'react-helmet';

import axios from '../../helpers/axiosConfig';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
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
import {withRouter} from 'react-router';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Collapse from '@material-ui/core/Collapse';
import {CircularProgress} from '@material-ui/core';
import ViewNav from './ViewNav';
import ListIcon from '@material-ui/icons/List';
import {fetchViewProject} from '../../actions/viewAction';
import Alert from '@material-ui/lab/Alert';
import {connect} from 'react-redux';

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
  },
  body: {
    backgroundImage:
      'linear-gradient(to top, #094183 0%, #5FA5E1 100%, #CAE8FA 100%)',
    padding: theme.spacing(6, 0, 6),
  },
  liketext: {
    marginTop: theme.spacing(1),
  },
  text: {
    marginTop: theme.spacing(1),
  },
});

const useStyles = makeStyles((theme) => ({
  item: {
    marginLeft: 8,
  },
  icon: {
    marginRight: 12,
  },
}));

//this render the process section
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
        {props.proc.nodes && props.proc.nodes.length > 0 ? (
          props.proc.nodes.map((node, i) => {
            return (
              <List>
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
              </List>
            );
          })
        ) : (
          <List>
            <ListItem className={classes.item}>
              <ListItemText>No task yet</ListItemText>
            </ListItem>
          </List>
        )}
      </Collapse>
    </List>
  );
}

class View_Project_Item extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.state = {
      project: [],
      view_user: 'default',
    };
  }

  componentDidMount = () => {
    console.log(this.props);
    const user_id = this.props.match.params.id;

    axios.get(`/view/${user_id}`).then((res) => {
      this.setState({view_user: res.data});
    });
    this.props.dispatch(
      fetchViewProject(this.props.match.params.project_id, user_id)
    );
  };

  handleClickOpen = () => {
    this.setState({open: true});
  };
  handleClickClose = () => {
    this.setState({open: true});
  };

  handleLikeClick = () => {
    //if(liked) {
    //do post request to unliked the project => number people like reduce by one
    //set liked = false
    //}else{
    //do post request to like the project => number people like increase by one
    //set liked = true
    //}
  };

  render() {
    const {classes} = this.props;
    const {error, isFetching, view_project} = this.props.view;
    console.log(view_project);
    let content;
    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
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
    } else if (!view_project) {
      content = (
        <Grid container justify="center" alignItems="center">
          <Typography>Cannot found the project requested.</Typography>
        </Grid>
      );
    } else {
      content = (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Description
                </Typography>
                <Divider />
                {view_project.description && view_project.description !== '' ? (
                  <Typography className={classes.text}>
                    {view_project.description}
                  </Typography>
                ) : (
                  <Typography className={classes.text}>
                    No Description Yet
                  </Typography>
                )}
              </CardContent>
            </Card>
            <br />
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Process
                </Typography>
                <Divider />
                {view_project.process && view_project.process.length > 0 ? (
                  view_project.process.map((proc, i) => {
                    return <Process proc={proc} />;
                  })
                ) : (
                  <Typography className={classes.text}>
                    No Process Yet
                  </Typography>
                )}
              </CardContent>
            </Card>
            <br />
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Timeline
                </Typography>
                <Divider />
                {view_project.timeline && view_project.timeline.length > 0 ? (
                  <Timeline>
                    {view_project.timeline.map((each, i) => {
                      return (
                        <TimelineItem align="left">
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
          <Grid item xs={12} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Status
                </Typography>
                <Divider />
                <Typography className={classes.text}>
                  Progress Status: {view_project.status}
                </Typography>
                <Typography>Show Status: {view_project.show_status}</Typography>
              </CardContent>
            </Card>
            <br />
            {/*<Card className={classes.card}>*/}
            {/*  <CardContent className={classes.cardContent}>*/}
            {/*    <Typography gutterBottom variant="h5" component="h2">Rating</Typography>*/}
            {/*    <Divider/>*/}
            {/*    <Typography className={classes.text}>{view_project.rating}{" "} likes</Typography>*/}
            {/*  </CardContent>*/}
            {/*</Card>*/}
            {/*<br />*/}
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Contributor
                </Typography>
                <Divider />
                <List>
                  {view_project.contributors &&
                    view_project.contributors.map((con, i) => {
                      return <ListItemText>{con}</ListItemText>;
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
        <ViewNav view_user={this.state.view_user} />
        <Helmet>
          <title>Microhard &middot; Project View</title>
        </Helmet>

        <div className={classes.body}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              style={{color: '#fff'}}
              gutterBottom
            >
              {view_project.name}
            </Typography>
            <br />
            <Grid container spacing={4} justify="center" alignItems="center">
              <Grid item>
                <Button
                  variant="contained"
                  href={`/view/${this.state.view_user._id}/project/`}
                  endIcon={<ListIcon />}
                >
                  Back to List
                </Button>
              </Grid>
            </Grid>
          </Container>

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
  connect(mapStateToProps)(withStyles(styles)(View_Project_Item))
);

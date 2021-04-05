import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import axios from '../../../helpers/axiosConfig';
import withStyles from '@material-ui/core/styles/withStyles';
import EmailIcon from '@material-ui/icons/Email';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import Typography from '@material-ui/core/Typography';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Alert from '@material-ui/lab/Alert';
import ShareIcon from '@material-ui/icons/Share';
import Avatar from '@material-ui/core/Avatar';
import PopupState, {bindPopover, bindTrigger} from 'material-ui-popup-state';
import Popover from '@material-ui/core/Popover';
import EditAvatar from './EditAvatar';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import SchoolIcon from '@material-ui/icons/School';
import PublicIcon from '@material-ui/icons/Public';
import Grow from '@material-ui/core/Grow';
import ImageGrid from '../Photos/ImageGrid';
import Button from '@material-ui/core/Button';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Tooltip from '@material-ui/core/Tooltip';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import {Link, withRouter} from 'react-router-dom';
import {fetchAvatar, postAvatar} from '../../../actions/photoAction';
import {CircularProgress} from '@material-ui/core';

const styles = (theme) => ({
  root: {
    backgroundImage:
      'linear-gradient(to top, #094183 0%, #5FA5E1 100%, #CAE8FA 100%)',
    marginTop: '-15px',
    padding: '25px 0 150px 0',
  },
  personal: {
    margin: '32px auto',
    padding: '20px',
    '& h1': {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
    '& h4': {
      paddingBottom: '10px',
    },
    [theme.breakpoints.down('sm')]: {
      '& h1': {
        textAlign: 'center',
        paddingBottom: '10px',
      },
      '& h4': {
        textAlign: 'center',
        paddingBottom: '10px',
      },
    },
  },
  avatar: {
    width: '170px',
    height: '170px',
    backgroundColor: '#F0F0F0',
  },
  primaryColor: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  socialIcon: {
    marginRight: '8px',
  },
  icons: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  secondSection: {
    margin: '32px auto',
    padding: '20px 32px',
    textAlign: 'left',
    color: '#657786',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  locationIcon: {
    position: 'relative',
    top: '7px',
    right: '2px',
  },
  graduationIcon: {
    position: 'relative',
    top: '7px',
    left: '-2px',
  },
  universityIcon: {
    position: 'relative',
    top: '7px',
    left: '-2px',
  },
  avatarSection: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  aboutSection: {
    margin: '32px auto',
    padding: '20px 32px',
  },
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      copied: false,
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    this.props.dispatch(postAvatar(formData, config));
  }
  onChange(e) {
    this.setState({file: e.target.files[0]});
  }

  componentDidMount() {
    let page = 1;
    if (this.props.match.params.page !== undefined) {
      page = this.props.match.params.page;
    }
    // Retrieve avatar image
    this.props.dispatch(fetchAvatar(page));

    axios.get('/pdf/').then((res) => {
      if (res.data.pdfs) {
        var resumeUrl = {getFileLink: '#'};
        var ele;
        for (ele of res.data.pdfs) {
          if (ele.isResume) {
            resumeUrl = ele;
            break;
          }
        }
        if (resumeUrl) {
          const resumeLink = (
            <a
              href={resumeUrl.getFileLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          );
          ReactDOM.render(resumeLink, document.getElementById('resume'));
        }
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      let page = 1;

      if (this.props.match.params.page !== undefined) {
        page = this.props.match.params.page;
      }
      this.props.dispatch(fetchAvatar(page));
    }
  }

  render() {
    const {classes} = this.props;
    const {user} = this.props.user;

    console.log(this.props);
    const path = window.location.host + '/view/';
    console.log(path);

    const {error, isFetching, avatar} = this.props.photo;

    let content;
    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
      //show the circular progress bar if database is still process
      content = (
        <Grid container justify="center" alignItems="center">
          <CircularProgress color="primary" />
        </Grid>
      );
    } else if (!avatar) {
      content = (
        <Avatar
          className={clsx(classes.primaryColor, classes.avatar)}
          alt="default avatar"
        />
      );
    } else {
      const imgPic = avatar.map((ele) => (
        <Avatar
          alt="Nothing Here"
          src={'/api/image/' + ele.filename}
          className={classes.avatar}
        />
      ));
      content = <div>{imgPic} </div>;
    }
    return (
      <Fragment>
        <Helmet>
          <title>Microhard &middot; Profile </title>
        </Helmet>
        <div className={classes.root}>
          <Container maxWidth="md">
            <Grow in timeout={900}>
              <div>
                <Grid
                  container
                  component={Paper}
                  className={classes.personal}
                  spacing={(2, 0)}
                  elevation={3}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={3}
                    className={classes.avatarSection}
                  >
                    <PopupState variant="popover" popupId="demo-popup-popover">
                      {(popupState) => (
                        <div>
                          <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                          >
                            <div {...bindTrigger(popupState)}>{content}</div>
                          </IconButton>
                          <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'center',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'center',
                            }}
                          >
                            <EditAvatar
                              onFormSubmit={this.onFormSubmit}
                              onChange={this.onChange}
                            />
                          </Popover>
                        </div>
                      )}
                    </PopupState>
                  </Grid>
                  <Grid item xs={12} sm={12} md={9}>
                    <Typography variant="h1">
                      {user.firstname} {user.lastname}
                    </Typography>
                    <Typography variant="h4">{user.headline}</Typography>
                    <Typography variant="h4">{user.major}</Typography>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      className={classes.icons}
                    >
                      <Fab
                        href={'mailto:' + user.email}
                        size="small"
                        color="secondary"
                        aria-label="email"
                        className={classes.socialIcon}
                      >
                        <EmailIcon />
                      </Fab>
                      {user.website && (
                        <Fab
                          color="secondary"
                          size="small"
                          href={user.website}
                          className={classes.socialIcon}
                          target="_blank"
                        >
                          <PublicIcon />
                        </Fab>
                      )}
                      {user.linkedin && (
                        <Fab
                          color="secondary"
                          size="small"
                          href={user.linkedin}
                          className={classes.socialIcon}
                          target="_blank"
                        >
                          <LinkedInIcon />
                        </Fab>
                      )}
                      {user._id && (
                        <Fab
                          size="small"
                          className={classes.socialIcon}
                          target="_blank"
                        >
                          <CopyToClipboard
                            text={
                              `https://comp30022-microhard.herokuapp.com` /*'http://localhost:3000'*/ +
                              `/view/${user._id}`
                            }
                            onCopy={() => this.setState({copied: true})}
                          >
                            <ShareIcon style={{color: '#3FA7C2'}} />
                          </CopyToClipboard>
                        </Fab>
                      )}
                      <Fab
                        size="small"
                        className={classes.socialIcon}
                        component={Link}
                        to="/account"
                      >
                        <EditIcon style={{color: '#657786'}} />
                      </Fab>
                      {this.state.copied ? (
                        <Alert severity="success" style={{marginTop: '12px'}}>
                          Share link has copied to the clipboard
                        </Alert>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Grow>
            <Grow in timeout={1100}>
              <div>
                <Grid
                  container
                  component={Paper}
                  className={classes.secondSection}
                >
                  <Grid item xs={12} sm={12} md={3}>
                    {user.location && (
                      <Typography variant="body1">
                        <LocationOnOutlinedIcon
                          className={classes.locationIcon}
                        />{' '}
                        {user.location}
                      </Typography>
                    )}
                    {user.graduation && (
                      <Tooltip
                        title="Expected graduation date"
                        placement="bottom-start"
                      >
                        <Typography variant="body1">
                          <SchoolIcon className={classes.graduationIcon} />{' '}
                          {user.graduation}
                        </Typography>
                      </Tooltip>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={5}>
                    <Typography variant="body1">
                      <AccountBalanceIcon className={classes.universityIcon} />{' '}
                      University of Melbourne
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className={classes.icons}>
                    <Tooltip title="To add/change your resume, go to the Personal Documents page">
                      <Button variant="outlined" color="primary" fullWidth>
                        <div id="resume"></div>
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
              </div>
            </Grow>
            <Grow in timeout={1300}>
              <div>
                <Grid
                  container
                  component={Paper}
                  elevation={3}
                  className={classes.aboutSection}
                >
                  <Grid item xs={12} sm={11} md={12}>
                    <Typography variant="h2" style={{paddingBottom: '10px'}}>
                      About Me
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{whiteSpace: 'pre-wrap'}}
                  >
                    <Typography variant="body1">{user.aboutSection}</Typography>
                  </Grid>
                </Grid>
              </div>
            </Grow>
            <Grow in timeout={1500}>
              <div>
                <Grid
                  container
                  component={Paper}
                  elevation={3}
                  className={classes.aboutSection}
                >
                  <Grid item xs={12} sm={11} md={12}>
                    <Typography variant="h2">Photos</Typography>
                  </Grid>
                  <Grid item xs={12} sm={11} md={12}>
                    <ImageGrid />
                  </Grid>
                </Grid>
              </div>
            </Grow>
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
  connect(mapStateToProps)(withStyles(styles)(Profile))
);

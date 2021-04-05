import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import axios from '../../helpers/axiosConfig';
import {Container, Grid, IconButton} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import EmailIcon from '@material-ui/icons/Email';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import Typography from '@material-ui/core/Typography';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Alert from '@material-ui/lab/Alert';
import ShareIcon from '@material-ui/icons/Share';
import Avatar from '@material-ui/core/Avatar';
import PopupState, {bindTrigger} from 'material-ui-popup-state';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import SchoolIcon from '@material-ui/icons/School';
import PublicIcon from '@material-ui/icons/Public';
import Gallery from 'react-grid-gallery';
import ViewNav from './ViewNav';
import Button from '@material-ui/core/Button';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import {
  fetchViewPhotos,
} from '../../actions/viewAction';

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

class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view_user: 'default',
      copied: false,
      file: null,
    };
  }

  componentDidMount() {
    const {classes} = this.props;
    const user_id = this.props.match.params.id;

    this.props.dispatch(fetchViewPhotos(1, user_id));

    axios.get(`/view/${user_id}`).then((res) => {
      this.setState({view_user: res.data});
    });

    axios.get(`/view/${user_id}/avatar`).then((res) => {
      if (res.data.files) {
        const imgPic = res.data.files.map((ele) => (
          <Avatar
            alt="Nothing Here"
            src={'/api/image/' + ele.filename}
            className={classes.avatar}
          />
        ));
        ReactDOM.render(imgPic, document.getElementById('avatar'));
      } else {
        const defaultAvatar = (
          <Avatar
            className={clsx(classes.primaryColor, classes.avatar)}
            alt="default avatar"
          >
            UK
          </Avatar>
        );
        ReactDOM.render(defaultAvatar, document.getElementById('avatar'));
      }
    });
    axios.get(`/view/${user_id}/pdf`).then((res) => {
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

  render() {
    const {classes} = this.props;
    console.log(this.props);
    const {error, isFetching, view_photos} = this.props.view;
    const view_user = this.state.view_user;

    let content;

    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isFetching) {
      content = (
        <Grid container justify="center" alignItems="center">
          <CircularProgress color="primary" />
        </Grid>
      );
    } else if (view_photos.length === 0 || !view_photos) {
      content = <p className="lead">No photos found.</p>;
    } else {
      const photodata = view_photos.map(getPhoto);

      function getPhoto(elem) {
        return {
          src: '/api/image/' + elem.filename,
          thumbnail: '/api/image/' + elem.filename,
          thumbnailWidth: 'auto',
          thumbnailHeight: 250,
          thumbnailCaption: elem.caption,
          caption: elem.caption,
        };
      }

      let photogrid = (
        <div
          style={{
            display: 'block',
            minHeight: '1px',
            width: '100%',
            border: '1px solid #ddd',
            overflow: 'auto',
            fontFamily: 'Nunito, Lato, sans-serif',
            textAlign: 'center',
            background: 'white',
          }}
        >
          <Gallery
            images={photodata}
            enableLightbox={true}
            enableImageSelection={false}
            currentImageWillChange={this.onCurrentImageChange}
          />
        </div>
      );
      content = <div>{photogrid}</div>;
    }
    return (
      <Fragment>
        <ViewNav view_user={this.state.view_user} />
        <Helmet>
          <title>Microhard &middot; Profile </title>
        </Helmet>
        <div className={classes.root}>
          <Container maxWidth="md">
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
                        <div id="avatar" {...bindTrigger(popupState)} />
                      </IconButton>
                    </div>
                  )}
                </PopupState>
              </Grid>
              <Grid item xs={12} sm={12} md={9}>
                <Typography variant="h1">
                  {view_user.firstname} {view_user.lastname}
                </Typography>
                <Typography variant="h4">{view_user.headline}</Typography>
                <Typography variant="h4">{view_user.major}</Typography>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  className={classes.socialIcons}
                >
                  <Fab
                    href={'mailto:' + view_user.email}
                    size="small"
                    color="secondary"
                    aria-label="email"
                    className={classes.socialIcon}
                  >
                    <EmailIcon />
                  </Fab>
                  {view_user.website && (
                    <Fab
                      color="secondary"
                      size="small"
                      href={view_user.website}
                      className={classes.socialIcon}
                      target="_blank"
                    >
                      <PublicIcon />
                    </Fab>
                  )}
                  {view_user.linkedin && (
                    <Fab
                      color="secondary"
                      size="small"
                      href={view_user.linkedin}
                      className={classes.socialIcon}
                      target="_blank"
                    >
                      <LinkedInIcon />
                    </Fab>
                  )}
                  {view_user._id && (
                    <Fab
                      color="secondary"
                      size="small"
                      className={classes.socialIcon}
                      target="_blank"
                    >
                      <CopyToClipboard
                        text={
                          `https://comp30022-microhard.herokuapp.com` /*'http://localhost:3000'*/ +
                          `/view/${view_user._id}`
                        }
                        onCopy={() => this.setState({copied: true})}
                      >
                        <ShareIcon />
                      </CopyToClipboard>
                    </Fab>
                  )}
                  {this.state.copied ? (
                    <Alert severity="success">
                      Share link has copied to the clipboard
                    </Alert>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
            <Grid container component={Paper} className={classes.secondSection}>
              <Grid item xs={12} sm={12} md={3}>
                {view_user.location && (
                  <Typography variant="body1">
                    <LocationOnOutlinedIcon className={classes.locationIcon} />{' '}
                    {view_user.location}
                  </Typography>
                )}
                {view_user.graduation && (
                  <Tooltip
                    title="Expected graduation date"
                    placement="bottom-start"
                  >
                    <Typography variant="body1">
                      <SchoolIcon className={classes.graduationIcon} />{' '}
                      {view_user.graduation}
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
                <Button variant="outlined" color="primary" fullWidth>
                  <div id="resume" />
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              component={Paper}
              elevation={3}
              className={classes.aboutSection}
            >
              <Grid item xs={12} sm={12} md={12}>
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
                <Typography variant="body1">
                  {view_user.aboutSection}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              component={Paper}
              elevation={3}
              className={classes.aboutSection}
            >
              <Grid item xs={12} sm={12} md={12}>
                <Typography variant="h2">Photos</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <div>{content}</div>
              </Grid>
            </Grid>
          </Container>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(withStyles(styles)(View));

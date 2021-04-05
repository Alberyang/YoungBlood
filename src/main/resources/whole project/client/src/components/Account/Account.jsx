import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {updateUser, deleteUser, resetPassword} from '../../actions/userAction';
import {Helmet} from 'react-helmet';
import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert';
import {Formik, ErrorMessage, Field, Form} from 'formik';
import * as Yup from 'yup';
import img from './form-background.jpg';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';

const validationSchema = Yup.object().shape({
  lastname: Yup.string().required('* Last name is required'),
  firstname: Yup.string().required('* First name is required'),
  username: Yup.string().required('* Username is required'),
  email: Yup.string()
    .email()
    .required('* Email is required, like name@example.com'),
  headline: Yup.string().trim().max(60, 'Too long! Character limit is 60'),
  linkedin: Yup.string().trim().max(80, 'Too long! Character limit is 80'),
  website: Yup.string().trim().max(80, 'Too long! Character limit is 80'),
  location: Yup.string().trim().max(60, 'Too long! Character limit is 60'),
  graduation: Yup.string().trim().max(60, 'Too long! Character limit is 60'),
  aboutSection: Yup.string(),
  password: Yup.string()
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  confirm: Yup.string()
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
});

const useStyles = (theme) => ({
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(5, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  logo: {
    maxHeight: '12rem',
    padding: '0px 10px',
    margin: '0px 20px',
  },
  image: {
    backgroundImage: 'url(' + img + ')',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  form: {
    width: '100%',
  },
  form_group: {
    padding: theme.spacing(0.5),
  },
});

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: false,
      open: false,
    };
    this.handleAlert = this.handleAlert.bind(this);
  }

  handleAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    this.setState({open: false, update: false});
  };

  render() {
    const {error, isAuthenticating, user} = this.props.user;
    const {classes} = this.props;

    const deleteAccount = (e) => {
      e.preventDefault();
      if (window.confirm('Are you sure you want to delete your account?')) {
        this.props.dispatch(deleteUser());
      }
    };

    let content;

    if (error) {
      content = <Alert severity="error">{error}</Alert>;
    } else if (isAuthenticating) {
      content = (
        <CircularProgress>
          <span>Loading...</span>
        </CircularProgress>
      );
    }

    return (
      <Fragment>
        <Helmet>
          <title>Microhard &middot; Account</title>
        </Helmet>

        <Grid container component="main" className={classes.root}>
          <Grid item xs={12} component={Paper} elevation={6} square>
            <div className={classes.paper}>
              <Typography variant="h1" padding="10px">
                Account
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4} component={Paper} elevation={6} square>
            <div className={classes.paper}>
              <Typography variant="h4" padding="10px">
                Basics
              </Typography>
              <Typography variant="h6" padding="10px">
                This information will be shown publicly so be careful what
                information you provide.
              </Typography>
            </div>
          </Grid>
          <Grid item xs={8} component={Paper} elevation={6} square>
            <div className={classes.paper}>
              <Formik
                initialValues={{
                  username: user.username,
                  email: user.email,
                  headline: user.headline,
                  lastname: user.lastname,
                  firstname: user.firstname,
                  major: user.major,
                  linkedin: user.linkedin,
                  location: user.location,
                  website: user.website,
                  graduation: user.graduation,
                  aboutSection: user.aboutSection,
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  this.props.dispatch(updateUser({user: values}));
                }}
              >
                {({errors, touched}) => (
                  <Form className={classes.form}>
                    <div className={classes.form_group}>
                      <Field
                        variant="outlined"
                        margin="normal"
                        type="text"
                        id="firstname"
                        name="firstname"
                        label="Change your first name"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="firstname"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.firstname && touched.firstname}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Field
                        variant="outlined"
                        margin="normal"
                        type="text"
                        id="lastname"
                        name="lastname"
                        label="Change your last name"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="lastname"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.lastname && touched.lastname}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Field
                        variant="outlined"
                        margin="normal"
                        type="text"
                        id="username"
                        name="username"
                        label="Change your username"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="username"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.username && touched.username}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Field
                        variant="outlined"
                        margin="normal"
                        type="email"
                        id="email"
                        name="email"
                        label="Change your email address"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="email"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.email && touched.email}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Field
                        variant="outlined"
                        margin="normal"
                        type="major"
                        id="major"
                        name="major"
                        label="Add/change your major"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="major"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.major && touched.major}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Field
                        autoComplete="off"
                        variant="outlined"
                        margin="normal"
                        id="graduation"
                        name="graduation"
                        label="Add/change your expected graduation date"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="graduation"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.graduation && touched.graduation}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Field
                        variant="outlined"
                        margin="normal"
                        id="headline"
                        name="headline"
                        label="Add/change your headline"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="headline"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.headline && touched.headline}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Field
                        type="url"
                        variant="outlined"
                        margin="normal"
                        id="linkedin"
                        name="linkedin"
                        label="Add/change your Linkedin link"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="linkedin"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.linkedin && touched.linkedin}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Field
                        type="url"
                        variant="outlined"
                        margin="normal"
                        id="website"
                        name="website"
                        label="Add/change your personal website"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="website"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.website && touched.website}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Field
                        autoComplete="off"
                        variant="outlined"
                        margin="normal"
                        id="location"
                        name="location"
                        label="Add/change your current location"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="location"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.location && touched.location}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Field
                        autoComplete="off"
                        variant="outlined"
                        id="aboutSection"
                        name="aboutSection"
                        label="Describe yourself"
                        margin="normal"
                        multiline
                        rows={10}
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="aboutSection"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.aboutSection && touched.aboutSection}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Button
                        type="submit"
                        variant="raised"
                        color="primary"
                        fullWidth
                        onClick={() => this.setState({update: true})}
                      >
                        Update Account
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className={classes.form_group}>{content}</div>
              <br />
            </div>
          </Grid>
          <Grid item xs={4} component={Paper} elevation={6} square>
            <div className={classes.paper}>
              <Typography
                variant="h4"
                fontWeight="fontWeightBold"
                padding="10px"
              >
                Change password
              </Typography>
              <Typography variant="h6" fontWeight="fontWeight" padding="10px">
                Set a unique password to protect your Microhard account.
              </Typography>
            </div>
          </Grid>
          <Grid item xs={8} component={Paper} elevation={6} square>
            <div className={classes.paper}>
              <Formik
                initialValues={{
                  password: '',
                  confirm: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  this.props.dispatch(
                    resetPassword(values, this.props.match.params.token)
                  );
                }}
              >
                {({errors, touched}) => (
                  <Form className={classes.form}>
                    <div className={classes.form_group}>
                      <Field
                        variant="outlined"
                        margin="normal"
                        type="password"
                        id="password"
                        name="password"
                        label="New password"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="password"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.password && touched.password}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Field
                        variant="outlined"
                        margin="normal"
                        type="password"
                        id="confirm"
                        name="confirm"
                        label="Confirm your new password"
                        fullWidth
                        as={TextField}
                        helperText={
                          <ErrorMessage
                            name="confirm"
                            className="invalid-feedback"
                          />
                        }
                        error={errors.confirm && touched.confirm}
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Button
                        type="submit"
                        variant="raised"
                        color="primary"
                        fullWidth
                      >
                        Update Your Password
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className={classes.form_group}>{content}</div>
              <br />
            </div>
          </Grid>
          <Grid item xs={4} component={Paper} elevation={6} square>
            <div className={classes.paper}>
              <Typography
                variant="h4"
                fontWeight="fontWeightBold"
                padding="10px"
              >
                Danger Zone
              </Typography>
              <Typography variant="h6" fontWeight="fontWeight" padding="10px">
                Once you delete your account, there is no going back. Please be
                certain.
              </Typography>
            </div>
          </Grid>
          <Grid item xs={8} component={Paper} elevation={6} square>
            <div className={classes.paper}>
              <Typography variant="h6" fontWeight="fontWeight" padding="10px">
                Delete account
              </Typography>
              <div className={classes.form_group}>
                <Button
                  onClick={deleteAccount}
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<DeleteIcon />}
                  fullWidth
                >
                  Delete your account
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>

        {this.state.update && !error ? (
          <Snackbar open autoHideDuration={4000} onClose={this.handleAlert}>
            <Alert
              onClose={this.handleAlert}
              severity="success"
              variant="filled"
            >
              Account was successfully uploaded!
            </Alert>
          </Snackbar>
        ) : null}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(withStyles(useStyles)(Account));

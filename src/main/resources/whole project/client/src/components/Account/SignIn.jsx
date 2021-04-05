import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {signInUser} from '../../actions/userAction';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import logo from '../../components/Navigation/logo.png';
import img from './form-background.jpg';
import * as Yup from 'yup';
import {CircularProgress} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {Grid, Button, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import '../../styles.css';

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required('*Email is required'),
  password: Yup.string().required('*Password is required'),
});

const useStyles = (theme) => ({
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    maxHeight: '12rem',
    padding: '0px 10px',
    margin: '0px 20px',
  },
  image: {
    backgroundImage: 'url(' + img + ')',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  form: {
    width: '100%',
  },
  form_group: {
    padding: '5px 5px 5px 5px',
  },
});

class SignIn extends Component {
  render() {
    const {error, isAuthenticating} = this.props.user;
    const {classes} = this.props;

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
          <title>Microhard &middot; Sign in</title>
        </Helmet>

        <Grid container component="main" className={classes.root}>
          <Grid item xs={false} sm={4} md={7} className={classes.image} />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <div className={classes.paper}>
              <Link to="/">
                <Button>
                  <img src={logo} alt="Microhard" className={classes.logo} />
                </Button>
              </Link>
              <br />
              <br />
              <Typography variant="h4">Sign in to your account</Typography>
              <Typography variant="h6">
                {'Or '}
                <Link color="inherit" to="/sign-up">
                  create a new account.
                </Link>
              </Typography>
              <Formik
                initialValues={{
                  email: '',
                  password: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  this.props.dispatch(signInUser({user: values}));
                }}
              >
                {({errors, touched}) => (
                  <Form className={classes.form}>
                    <div className={classes.form_group}>
                      <Field
                        variant="outlined"
                        margin="normal"
                        id="email"
                        label="Enter your email address"
                        name="email"
                        as={TextField}
                        type="email"
                        fullWidth
                        autoFocus
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
                        name="password"
                        as={TextField}
                        label="Enter your password"
                        type="password"
                        fullWidth
                        id="password"
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
                      <Link to="/forgot-password" variant="body2">
                        Forgot password?
                      </Link>
                    </div>
                    <div className={classes.form_group}>
                      <Button type="submit" color="primary" fullWidth>
                        Sign in
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className={classes.form_group}>{content}</div>
              <br />
            </div>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(withStyles(useStyles)(SignIn));

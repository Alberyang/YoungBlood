import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {resetPassword} from '../../actions/userAction';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import {Formik, ErrorMessage, Field, Form} from 'formik';
import logo from '../Navigation/logo.png';
import * as Yup from 'yup';

import {Grid, Button, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import img from './form-background.jpg';

const validationSchema = Yup.object().shape({
  password: Yup.string().required('* Password is required'),
  confirm: Yup.string().required('* Confirm password is required'),
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
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  form: {
    width: '100%',
  },
  form_group: {
    padding: '5px 5px 5px 5px',
  },
});

class ResetPassword extends Component {
  render() {
    const {classes} = this.props;
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
                  <img
                    src={logo}
                    alt="Microhard"
                    className={classes.logo}
                    loading="lazy"
                  />
                </Button>
              </Link>
              <Typography
                variant="h4"
                fontWeight="fontWeightBold"
                padding="10px"
              >
                Sign in to your account
              </Typography>
              <Typography variant="h6">
                {'Or '}
                <Link color="inherit" to="/sign-up">
                  create a new account.
                </Link>
              </Typography>
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
                      <Typography variant="body2">Password</Typography>
                      <Field
                        variant="outlined"
                        margin="normal"
                        name="password"
                        label="Enter your new password"
                        type="password"
                        fullWidth
                        id="password"
                        className={`form-control ${
                          touched.password && errors.password
                            ? 'is-invalid'
                            : ''
                        }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="password"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Typography variant="body2">Confirm password</Typography>
                      <Field
                        variant="outlined"
                        margin="normal"
                        name="confirm"
                        label="Confirm your new password"
                        type="password"
                        fullWidth
                        id="confirm"
                        className={`form-control ${
                          touched.confirm && errors.confirm ? 'is-invalid' : ''
                        }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="confirm"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className={classes.form_group}>
                      <Button
                        type="submit"
                        variant="raised"
                        color="primary"
                        fullWidth
                      >
                        Reset Password
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
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

export default connect(mapStateToProps)(withStyles(useStyles)(ResetPassword));

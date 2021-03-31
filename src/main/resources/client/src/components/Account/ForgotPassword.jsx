import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {forgotPassword} from '../../actions/userAction';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import {Formik, ErrorMessage, Field, Form} from 'formik';
import logo from '../../components/Navigation/logo.png';
import * as Yup from 'yup';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import img from './form-background.jpg';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required('*Email is required'),
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

class ForgotPassword extends Component {
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
                Forgot your password?
              </Typography>
              <Typography variant="h6">
                {'Or return to '}
                <Link color="inherit" to="/sign-in">
                  sign in.
                </Link>
              </Typography>
              <Formik
                initialValues={{
                  email: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  this.props.dispatch(forgotPassword(values));
                }}
              >
                {({errors, touched}) => (
                  <Form className={classes.form}>
                    <div className={classes.form_group}>
                      <Field
                        as={TextField}
                        variant="outlined"
                        margin="normal"
                        id="email"
                        label="Enter your email address"
                        name="email"
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

export default connect(mapStateToProps)(withStyles(useStyles)(ForgotPassword));

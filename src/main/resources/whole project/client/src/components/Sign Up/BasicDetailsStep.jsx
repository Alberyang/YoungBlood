/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import React, {useEffect} from 'react';
import {Formik} from 'formik';
import {Button, Grid, Typography} from '@material-ui/core';
import * as Yup from 'yup';

// Inputs
import {FormItem} from 'react-material-formik-wizard';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  formItem: {
    margin: '10px 0px',
  },
  paperGrid: {
    padding: '30px',
  },
  button: {
    padding: '15px 30px',
  },
}));

const BasicDetailsSchema = Yup.object().shape({
  lastname: Yup.string().required('*Last name is required'),
  firstname: Yup.string().required('*First name is required'),
  username: Yup.string().trim().required('*Username is required'),
  email: Yup.string()
    .trim()
    .email()
    .required('*Enter an email address, like name@example.com'),
  password: Yup.string()
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .required('*Password is required'),
});

const BasicDetailsStep = (props) => {
  const {next, values} = props;
  const classes = useStyles();

  useEffect(() => {
    const mapValues = () => {
      values.lastname = values.lastname ? values.lastname : '';
      values.firstname = values.firstname ? values.firstname : '';
      values.username = values.username ? values.username : '';
      values.email = values.email ? values.email : '';
      values.password = values.password ? values.password : '';
    };
    mapValues();
  }, []);

  return (
    <React.Fragment>
      <Container>
        <Formik
          initialValues={{
            lastname: values.lastname,
            firstname: values.firstname,
            username: values.username,
            email: values.email,
            password: values.password,
          }}
          validationSchema={BasicDetailsSchema}
          onSubmit={(values) => {
            next({
              lastname: values.lastname,
              firstname: values.firstname,
              username: values.username,
              email: values.email,
              password: values.password,
            });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid
                container
                spacing={0}
                direction="row"
                justify="center"
                component={Paper}
                className={classes.paperGrid}
                elevation={3}
              >
                <Typography
                  variant="h2"
                  type="title"
                  color="inherit"
                  style={{flex: 1}}
                >
                  Basic User Details
                </Typography>
                <Grid item xs={12} sm={12} md={12} className={classes.formItem}>
                  <FormItem
                    id="firstname"
                    name="firstname"
                    type="text"
                    label="First Name *"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={'Enter your first name'}
                    value={values.firstname}
                    error={errors.firstname}
                    touched={touched.firstname}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.formItem}>
                  <FormItem
                    id="lastname"
                    name="lastname"
                    type="text"
                    label="Last Name *"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={'Enter your last name'}
                    value={values.lastname}
                    error={errors.lastname}
                    touched={touched.lastname}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.formItem}>
                  <FormItem
                    id="username"
                    name="username"
                    type="text"
                    label="Username *"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={'Enter your username'}
                    value={values.username}
                    error={errors.username}
                    touched={touched.username}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.formItem}>
                  <FormItem
                    id="email"
                    name="email"
                    type="email"
                    label="Email address *"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={'email@example.com'}
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.formItem}>
                  <FormItem
                    id="password"
                    name="password"
                    type="password"
                    label="Password *"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={'secret password'}
                    value={values.password}
                    error={errors.password}
                    touched={touched.password}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={0}
                direction="row"
                justify="space-between"
              >
                <Grid item>
                  <br />
                </Grid>
                <Grid item>
                  <Button
                    disabled={isSubmitting || Object.entries(errors).length > 0}
                    type="submit"
                    className={classes.button}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Container>
    </React.Fragment>
  );
};
export default BasicDetailsStep;

/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import React, {useEffect} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';

// Inputs
import {FormItem} from 'react-material-formik-wizard';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
  gridItem: {
    padding: '15px 0px',
  },
}));

const AboutSchema = Yup.object().shape({
  location: Yup.string().trim().max(60, 'Too long! Character limit is 60'),
  website: Yup.string().trim().max(80, 'Too long! Character limit is 80'),
  linkedin: Yup.string().trim().max(80, 'Too long! Character limit is 80'),
});

const ContactStep = (props) => {
  const classes = useStyles();
  const {next, back, values} = props;

  useEffect(() => {
    const mapValues = () => {
      values.location = values.location ? values.location : '';
      values.website = values.website ? values.website : '';
      values.linkedin = values.linkedin ? values.linkedin : '';
    };
    mapValues();
  }, []);

  return (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={{
          location: values.location,
          website: values.website,
          linkedin: values.linkedin,
        }}
        validationSchema={AboutSchema}
        onSubmit={(values) => {
          next({
            location: values.location,
            website: values.website,
            linkedin: values.linkedin,
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
              direction="row"
              justify="center"
              component={Paper}
              className={classes.paperGrid}
              elevation={3}
              spacing={2}
            >
              <Grid item xs={12} className={classes.gridItem}>
                <Typography
                  variant="h2"
                  type="title"
                  color="inherit"
                  style={{flex: 1}}
                >
                  Contacts and Socials
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.gridItem}>
                <FormItem
                  id="location"
                  name="location"
                  type="text"
                  label="Current location you are based in"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={'Enter your location'}
                  value={values.location}
                  error={errors.location}
                  touched={touched.location}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} className={classes.gridItem}>
                <FormItem
                  id="website"
                  name="website"
                  type="url"
                  label="Website"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={'https://www.example.com'}
                  value={values.website}
                  error={errors.website}
                  touched={touched.website}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} className={classes.gridItem}>
                <FormItem
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  label="LinkedIn"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={'Enter your LinkedIn link'}
                  value={values.linkedin}
                  error={errors.linkedin}
                  touched={touched.linkedin}
                />
              </Grid>
            </Grid>
            <Grid container direction="row" justify="space-between" spacing={1}>
              <Grid item>
                <Button
                  disabled={isSubmitting}
                  onClick={(e) => back(e, values)}
                  className={classes.button}
                >
                  Back
                </Button>
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
    </React.Fragment>
  );
};
export default ContactStep;

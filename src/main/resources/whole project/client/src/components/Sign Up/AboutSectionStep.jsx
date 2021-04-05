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
  major: Yup.string().trim().max(60, 'Too long! Character limit is 60'),
  headline: Yup.string().trim().max(60, 'Too long! Character limit is 60'),
  aboutSection: Yup.string().trim(),
  graduation: Yup.string().trim().max(60, 'Too long! Character limit is 60'),
});

const AboutSectionStep = (props) => {
  const classes = useStyles();
  const {next, back, values} = props;

  useEffect(() => {
    const mapValues = () => {
      values.aboutSection = values.aboutSection ? values.aboutSection : '';
      values.major = values.major ? values.major : '';
      values.headline = values.headline ? values.headline : '';
      values.graduation = values.graduation ? values.graduation : '';
    };
    mapValues();
  }, []);

  return (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={{
          aboutSection: values.aboutSection,
          major: values.major,
          headline: values.headline,
          graduation: values.graduation,
        }}
        validationSchema={AboutSchema}
        onSubmit={(values) => {
          next({
            aboutSection: values.aboutSection,
            major: values.major,
            headline: values.headline,
            graduation: values.graduation,
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
                About
              </Typography>
              <Grid item xs={12} className={classes.gridItem}>
                <FormItem
                  id="headline"
                  name="headline"
                  type="text"
                  label="Headline"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={
                    '2nd Year Veterinary Medicine undergraduate student'
                  }
                  value={values.headline}
                  error={errors.headline}
                  touched={touched.headline}
                />
              </Grid>
              <Grid item xs={12} className={classes.gridItem}>
                <FormItem
                  id="major"
                  name="major"
                  type="text"
                  label="Major"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={
                    'Computer Science / Architecture / History? Diploma in Languages?'
                  }
                  value={values.major}
                  error={errors.major}
                  touched={touched.major}
                />
              </Grid>
              <Grid item xs={12} className={classes.gridItem}>
                <FormItem
                  id="graduation"
                  name="graduation"
                  type="text"
                  label="Expected graduation date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={'Format: 6th Nov 2020'}
                  value={values.graduation}
                  error={errors.graduation}
                  touched={touched.graduation}
                />
              </Grid>
              <Grid item xs={12} className={classes.gridItem}>
                <FormItem
                  id="aboutSection"
                  name="aboutSection"
                  type="textarea"
                  label="About section"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={'Describe yourself'}
                  value={values.aboutSection}
                  error={errors.aboutSection}
                  touched={touched.aboutSection}
                />
              </Grid>
            </Grid>
            <Grid container spacing={0} direction="row" justify="space-between">
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
export default AboutSectionStep;

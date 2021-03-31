import React, {useState} from 'react';
import {Grid, Button, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
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

const ReviewStep = (props) => {
  const classes = useStyles();
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    props.handleSubmit();
    setSubmitting(false);
  };

  return (
    <React.Fragment>
      <Grid
        container
        spacing={0}
        direction="row"
        justify="flex-start"
        component={Paper}
        className={classes.paperGrid}
        elevation={3}
      >
        <Grid item xs={12} sm={12} md={12}>
          <Typography variant="h2" color="inherit" className={classes.formItem}>
            User Profile Review
          </Typography>
        </Grid>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3} md={3}>
            <Typography
              variant="h4"
              color="primary"
              className={classes.formItem}
            >
              Full Name:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={3}>
            <Typography variant="h6" className={classes.formItem}>
              {props.values.firstname} {props.values.lastname}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Typography
              variant="h4"
              color="primary"
              className={classes.formItem}
            >
              Email address:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={3}>
            <Typography variant="h6" className={classes.formItem}>
              {props.values.email}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Typography
              variant="h4"
              color="primary"
              className={classes.formItem}
            >
              Username:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={3}>
            <Typography variant="h6" className={classes.formItem}>
              {props.values.username}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Typography
              variant="h4"
              color="primary"
              className={classes.formItem}
            >
              Headline:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={3}>
            <Typography variant="h6" className={classes.formItem}>
              {props.values.headline}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Typography
              variant="h4"
              color="primary"
              className={classes.formItem}
            >
              Major:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={3}>
            <Typography variant="h6" className={classes.formItem}>
              {props.values.major}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Typography
              variant="h4"
              color="primary"
              className={classes.formItem}
            >
              Location:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={3}>
            <Typography variant="h6" className={classes.formItem}>
              {props.values.location}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Typography
              variant="h4"
              color="primary"
              className={classes.formItem}
            >
              Graduation:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={3}>
            <Typography variant="h6" className={classes.formItem}>
              {props.values.graduation}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Typography
              variant="h4"
              color="primary"
              className={classes.formItem}
            >
              Website:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={3}>
            <Typography variant="h6" className={classes.formItem}>
              {props.values.website}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Typography
              variant="h4"
              color="primary"
              className={classes.formItem}
            >
              LinkedIn:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={3}>
            <Typography variant="h6" className={classes.formItem}>
              {props.values.linkedin}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={12} style={{whiteSpace: 'pre-wrap'}}>
            <Typography
              variant="h4"
              color="primary"
              className={classes.formItem}
            >
              About us section:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={9} md={12}>
            <Typography variant="h6">{props.values.aboutSection}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={0} direction="row" justify="space-between">
        <Grid item>
          <Button
            className={classes.button}
            disabled={isSubmitting}
            onClick={(e) => props.back(e, props.values)}
          >
            Back
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.button}
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ReviewStep;

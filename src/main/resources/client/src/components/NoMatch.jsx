import React, {Fragment} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {Helmet} from 'react-helmet';
import img from '../img/404.png';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Grow from '@material-ui/core/Grow';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4, 10),
  },
  img: {
    maxWidth: '600px',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '350px',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  heading: {
    fontSize: '50px',
  },
  button: {
    textDecoration: 'none !important',
  },
}));

export default function NoMatch() {
  const classes = useStyles();

  return (
    <Fragment>
      <Helmet>
        <title>404 Page Not Found</title>
      </Helmet>
      <div className={classes.root}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          spacing={5}
        >
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h3">404 NOT FOUND</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h1" className={classes.heading}>
              I have bad news for you
            </Typography>
            <br />
            <br />
            <Typography variant="h3">
              The page you're looking for might be removed or temporarily
              unavailable.
            </Typography>
            <br />
            <br />
            <Button
              variant="contained"
              size="large"
              color="primary"
              className={classes.button}
              to="/"
              component={Link}
            >
              Back to homepage
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Grow in timeout={1000}>
              <img src={img} alt="404" className={classes.img} />
            </Grow>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
}

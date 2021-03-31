import React from 'react';
import Appbar from '../Navigation/Appbar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import aboutImg from '../About/about.png';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import {CardContent} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage:
      'linear-gradient(to top, #094183 0%, #5FA5E1 100%, #CAE8FA 100%)',
    minHeight: '113vh',
  },
  grid: {
    paddingTop: '100px',
  },
  image: {
    maxWidth: '430px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: '100px',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '310px',
      paddingTop: '40px',
    },
  },
  paper: {
    borderRadius: '5%',
    padding: '15px',
  },
}));

export default function About() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Appbar />
      <div className={classes.root}>
        <Container maxWidth="md">
          <Grid container spacing={4} className={classes.grid}>
            <Grid item xs={12} sm={12} md={6}>
              <Grow in timeout={1000}>
                <img src={aboutImg} className={classes.image} alt="about img" />
              </Grow>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Grow in timeout={1000}>
                <div>
                  <Paper className={classes.paper}>
                    <CardHeader
                      title={
                        <Typography variant="h2" align="center">
                          About us and our mission
                        </Typography>
                      }
                    />
                    <Divider variant="middle" />
                    <CardContent>
                      <Typography variant="h4">
                        To help UniMelb students showcase their work in a clean,
                        concise and job-winning manner.
                        <br />
                        <br />
                      </Typography>
                      <Typography>
                        There will come a time when we university students will
                        want to present the best versions of ourselves whether
                        it be for work shadowing, internships, or full-time
                        jobs. Demonstrating a well-articulated and polished
                        portfolio during an interview would definitely leave an
                        impression on potential employers. A portfolio can give
                        hiring managers insight into your abilities and
                        qualities, as well as your past works.
                        <br />
                        <br />
                        And that's why Microhard was created. Microhard is an
                        online platform that helps UniMelb students share their
                        customised portfolios privately to potential employers.
                        We hope that with this implementation, we support each
                        and every student by presenting themselves in the best
                        possible light.
                      </Typography>
                    </CardContent>
                  </Paper>
                </div>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </div>
    </React.Fragment>
  );
}

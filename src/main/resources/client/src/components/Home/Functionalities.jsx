import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import styled, {keyframes} from 'styled-components';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '20px 0px 100px 0px',
  },
  greyText: {
    color: 'grey',
  },
  body: {
    align: 'center',
    color: 'grey',
    lineHeight: '1.3',
    paddingTop: '5px',
  },
  icon: {
    width: 'auto',
    height: '80px',
    marginBottom: '24px',
  },
}));

const float = keyframes`
    from { transform: translate(0,  -6px); }
    65%  { transform: translate(-3px, 6px); }
    to   { transform: translate(0, -6px); }
`;

const Float = styled.div`
  animation: ${float} 4.5s linear infinite;
`;

export default function Functionalities() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container fixed>
        <br />
        <br />
        <br />
        <br />
        <Grid container justify="center" alignItems="center" align="center">
          <Grid item xs={12} sm={12}>
            <Typography variant="h2">How can Microhard help you...</Typography>
            <Typography variant="h4">From a student's perspective</Typography>
            <br />
            <br />
            <br />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid item xs={10} sm={8}>
              <Float>
                <img
                  src="https://www.flaticon.com/svg/static/icons/svg/3594/3594995.svg"
                  alt="skill"
                  className={classes.icon}
                />
              </Float>
              <Typography variant="h5" align="center">
                Showcase your e-portfolio to employers
              </Typography>
              <Typography variant="body1" className={classes.body}>
                By featuring your projects, personality, and capabilities, your
                portfolio showcases your character and identity.
              </Typography>
            </Grid>
            <br />
            <br />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid item xs={10} sm={8}>
              <Float>
                <img
                  src="https://www.flaticon.com/svg/static/icons/svg/1308/1308491.svg"
                  alt="skill"
                  className={classes.icon}
                />
              </Float>
              <Typography variant="h5" align="center">
                Share your e-portfolio privately
              </Typography>
              <Typography variant="body1" className={classes.body}>
                Students have the capability to share their e-portfolio
                privately to potential recruiters
              </Typography>
            </Grid>
            <br />
            <br />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid item xs={10} sm={8}>
              <Float>
                <img
                  src="https://www.flaticon.com/svg/static/icons/svg/1820/1820042.svg"
                  alt="skill"
                  className={classes.icon}
                />
              </Float>
              <Typography variant="h5" align="center">
                Employers can 'like' your project
              </Typography>
              <Typography variant="body1" className={classes.body}>
                Employers 'liking' a project gives students encouragement to
                improve and take on challenging tasks
              </Typography>
            </Grid>
            <br />
            <br />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid item xs={10} sm={8}>
              <Float>
                <img
                  src="https://www.flaticon.com/svg/static/icons/svg/1881/1881518.svg"
                  alt="skill"
                  className={classes.icon}
                />
              </Float>
              <Typography variant="h5" align="center">
                Organises your components in a logical way
              </Typography>
              <Typography variant="body1" className={classes.body}>
                The important components are already logically structured, all
                the user needs to do is add their information
              </Typography>
            </Grid>
            <br />
            <br />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

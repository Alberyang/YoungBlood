import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Toolbar, Button} from '@material-ui/core';
import logo from './logo.png';
import {Link} from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  logo: {
    maxHeight: '2.7rem',
    padding: '0px 5px',
  },
  navItem: {
    marginLeft: 'auto',
    marginRight: '30px',
    padding: '0px 10px',
    fontWeight: '600',
  },
  greyText: {
    color: 'grey',
    textTransform: 'none',
  },
  appbar: {
    backgroundColor: '#F4F5F7',
  },
});

export default function Appbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appbar}>
        <Toolbar>
          <Button component={Link} to="/">
            <img className={classes.logo} src={logo} alt={'logo'} />
          </Button>

          <div className={classes.navItem}>
            <Button
              component={Link}
              to="/about"
              className={classes.greyText}
              style={{margin: '0px 10px'}}
            >
              About us
            </Button>

            <Button
              component={Link}
              to="/sign-in"
              className={classes.greyText}
              style={{margin: '0px 20px 0px 10px'}}
            >
              Sign in
            </Button>

            <Button
              component={Link}
              to="/sign-up"
              variant="outlined"
              color={'primary'}
            >
              Join now
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

// Referenced https://github.com/dhruvmetha/Responsive-App-Bar

import React, { Component } from "react";
import { connect } from "react-redux";
import { signOutUser } from "../../actions/userAction";
import { Link } from "react-router-dom";
import logo from "../../components/Navigation/logo.png";
import withStyles from "@material-ui/core/styles/withStyles";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const styles = (theme) => ({
  button: {
    color: "grey",
    margin: "0px 12px",
    textTransform: "none",
  },
  logo: {
    maxHeight: "2.7rem",
    padding: "0px 10px",
    margin: "0px 15px",
  },
  buttonSection: {
    flex: "1",
    textAlign: "center",
    marginLeft: "-43px",
  },
  appbar: {
    backgroundColor: "#F4F5F7",
    color: "#000",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  noDecoration: {
    textDecoration: "none !important",
  },
  list: {
    width: 200,
  },
  padding: {
    paddingRight: 30,
    cursor: "pointer",
  },
  sideBarIcon: {
    padding: 0,
    color: "black",
    cursor: "pointer",
  },
  icon: {
    color: theme.palette.primary.main,
  },
});

// This is the navigation bar after a successful login
class PrimaryNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      drawerActivate: false,
      drawer: false,
    };
    this.createDrawer = this.createDrawer.bind(this);
    this.destroyDrawer = this.destroyDrawer.bind(this);
  }

  componentWillMount() {
    if (window.innerWidth <= 900) {
      this.setState({ drawerActivate: true });
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth <= 900) {
        this.setState({ drawerActivate: true });
      } else {
        this.setState({ drawerActivate: false });
      }
    });
  }

  //Small Screens
  createDrawer(classes, user, signOut) {
    return (
      <div>
        <AppBar position="sticky" className={classes.appbar}>
          <Toolbar>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <MenuIcon
                className={this.props.classes.sideBarIcon}
                onClick={() => {
                  this.setState({ drawer: true });
                }}
              />

              <Button>
                <img src={logo} alt="Microhard" className={classes.logo} />
              </Button>
            </Grid>
          </Toolbar>
        </AppBar>

        <SwipeableDrawer
          open={this.state.drawer}
          onClose={() => {
            this.setState({ drawer: false });
          }}
          onOpen={() => {
            this.setState({ drawer: true });
          }}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => {
              this.setState({ drawer: false });
            }}
            onKeyDown={() => {
              this.setState({ drawer: false });
            }}
          >
            <List className={this.props.classes.list}>
              <ListItem key={1} button divider>
                <Link exact={true} to="/" className={classes.noDecoration}>
                  <Button className={classes.button}>Profile</Button>
                </Link>
              </ListItem>
              <ListItem key={2} button divider>
                <Link to="/course" className={classes.noDecoration}>
                  <Button className={classes.button}>Course</Button>
                </Link>
              </ListItem>
              <ListItem key={3} button divider>
                <Link to="/experiences" className={classes.noDecoration}>
                  <Button className={classes.button}>Experiences</Button>
                </Link>
              </ListItem>
              <ListItem key={4} button divider>
                <Link to="/project" className={classes.noDecoration}>
                  <Button className={classes.button}>Projects</Button>
                </Link>
              </ListItem>
              <ListItem key={5} button divider>
                <Link to="/image" className={classes.noDecoration}>
                  <Button className={classes.button}>Photos</Button>
                </Link>
              </ListItem>
              <ListItem key={6} button divider>
                <Link to="/document" className={classes.noDecoration}>
                  <Button exact={true} className={classes.button}>
                    Documents
                  </Button>
                </Link>
              </ListItem>

              {/* New code for square */}
              <ListItem key={10} button divider>
                <Link to="/square" className={classes.noDecoration}>
                  <Button className={classes.button}>Square</Button>
                </Link>
              </ListItem>

              <ListItem key={7} button divider>
                <MenuItem component={Link} to="/account">
                  Account
                </MenuItem>
              </ListItem>
              <ListItem key={8} button divider>
                <MenuItem href="/" onClick={signOut}>
                  Sign out
                </MenuItem>
              </ListItem>
            </List>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

  //Larger Screens
  destroyDrawer(classes, user, signOut, content) {
    return (
      <AppBar position="sticky" className={classes.appbar}>
        <Toolbar>
          <Link to="/">
            <Button>
              <img src={logo} alt="Microhard" className={classes.logo} />
            </Button>
          </Link>
          <div className={classes.buttonSection}>
            <Link exact="true" to="/" className={classes.noDecoration}>
              <Button className={classes.button}>Profile</Button>
            </Link>
            <Link to="/course" className={classes.noDecoration}>
              <Button className={classes.button}>Course</Button>
            </Link>
            <Link to="/experiences" className={classes.noDecoration}>
              <Button className={classes.button}>Experiences</Button>
            </Link>
            <Link to="/project" className={classes.noDecoration}>
              <Button className={classes.button}>Projects</Button>
            </Link>
            <Link to="/image" className={classes.noDecoration}>
              <Button className={classes.button}>Photos</Button>
            </Link>
            <Link exact="true" to="/document" className={classes.noDecoration}>
              <Button className={classes.button}>Personal documents</Button>
            </Link>

            {/* New code for square */}
            <Link to="/square" className={classes.noDecoration}>
              <Button className={classes.button}>Square</Button>
            </Link>
          </div>

          <div>
            <PopupState variant="popover" popupId="demo-popup-popover">
              {(popupState) => (
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <AccountCircleIcon
                      {...bindTrigger(popupState)}
                      fontSize="large"
                      className={classes.icon}
                    />
                  </IconButton>
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <MenuItem component={Link} to="/account">
                      Account
                    </MenuItem>
                    <MenuItem href="/" onClick={signOut}>
                      Sign out
                    </MenuItem>
                  </Popover>
                </div>
              )}
            </PopupState>
          </div>
          {content}
        </Toolbar>
      </AppBar>
    );
  }

  render() {
    const { classes } = this.props;
    const { user } = this.props.user;
    let content;

    const signOut = (e) => {
      e.preventDefault();
      window.location.reload(false);
      this.props.dispatch(signOutUser());
    };

    return (
      <div>
        {this.state.drawerActivate
          ? this.createDrawer(classes, user, signOut)
          : this.destroyDrawer(classes, user, signOut, content)}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(withStyles(styles)(PrimaryNav));

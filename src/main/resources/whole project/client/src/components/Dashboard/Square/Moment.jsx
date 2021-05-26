import React, {Component} from 'react';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';
import Divider from '@material-ui/core/Divider';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MomentBox from './MomentBox';
import MomentCard from './MomentCard';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import axios from '../../../helpers/axiosConfig';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import MenuList from '@material-ui/core/MenuList';
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';
import UpToTop from '@material-ui/icons/Publish';
import DownToBottom from '@material-ui/icons/GetApp';
import MsgBar from './MessageBar';

const styles = (theme) => ({
  section: {
    height: '120px',
    backgroundColor: '#094183',
  },
  heading: {
    color: '#fff',
    fontSize: '36px',
  },
  moments: {
    width: '100%',
  },
});

class Moment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moments: undefined,
      tabSelected: 0,
      updateFlag: false,
      snackbar: undefined,
    };
  }

  async fetchMoments(refresh) {
    const response = await axios.get(
      `http://121.4.57.204:8080/info/606c453064ad461348e31a23?isRefresh=${refresh}`
    );
    return response;
  }

  handleChange = (event, newValue) => {
    this.setState({tabSelected: newValue});
  };

  updateMoments = (data) => {
    this.setState({
      moments: data,
    });
  };

  refreshPage = () => {
    document.documentElement.scrollTop = 0;
    const response = this.fetchMoments('True');
    response.then((res) => {
      this.setState({
        snackbar: (
          <MsgBar
            msg="Successfully refreshed new moments!"
            severity="success"
          />
        ),
      });
      setTimeout(() => this.setState({snackbar: undefined}), 5 * 1000);
      this.setState({moments: res.data.data});
    });
  };

  updateView = (data) => {
    this.setState({
      updateFlag: data,
    });
  };

  handleScroll = (e) => {
    if (
      document.documentElement.scrollTop +
        document.documentElement.clientHeight ===
      document.documentElement.scrollHeight
    ) {
      const response = this.fetchMoments('False');
      response.then(
        (res) => {
          if (res.data.data) {
            this.setState({
              snackbar: (
                <MsgBar
                  msg="Successfully refreshed new moments!"
                  severity="success"
                />
              ),
            });
            setTimeout(() => this.setState({snackbar: undefined}), 5 * 1000);
            if (this.state.moments) {
              this.state.moments.push(...res.data.data);
              this.setState({moments: this.state.moments});
            } else {
              this.setState({moments: res.data.data});
            }
          } else {
            this.setState({
              snackbar: <MsgBar msg="No more new moments!" severity="error" />,
            });
            setTimeout(() => this.setState({snackbar: undefined}), 5 * 1000);
          }
        },
        (error) => {
          this.setState({
            snackbar: <MsgBar msg="No more new moments!" severity="error" />,
          });
          setTimeout(() => this.setState({snackbar: undefined}), 5 * 1000);
        }
      );
    }
  };

  scrollUp() {
    document.documentElement.scrollTop = 0;
  }

  scrollDown() {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }

  componentDidMount() {
    const response = this.fetchMoments('True');
    response.then((res) => {
      this.setState({moments: res.data.data});
    });
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  generateView(filter_id) {
    const {classes} = this.props;
    if (!filter_id) {
      return (
        <>
          <MomentBox
            moments={this.state.moments}
            updateMoments={this.updateMoments}
            updateView={this.updateView}
          />
          <Card className={classes.moments}>
            <CardContent id="moment_card">
              {this.state.moments
                ? this.state.moments.map((item, index) => (
                    <MomentCard
                      key={index}
                      moment={item}
                      updateMoments={this.updateMoments}
                      momentList={this.state.moments}
                      user={this.props.user}
                    />
                  ))
                : undefined}
            </CardContent>
          </Card>
        </>
      );
    } else {
      let filterMoments = this.state.moments
        ? this.state.moments.filter((item) => {
            return item.user === filter_id;
          })
        : undefined;
      return (
        <Card
          style={{
            marginLeft: '20px',
            marginTop: '20px',
            width: '100%',
          }}
        >
          <CardContent id="moment_card">
            {filterMoments
              ? filterMoments.map((item, index) => (
                  <MomentCard
                    key={index}
                    moment={item}
                    updateMoments={this.updateMoments}
                    momentList={this.state.moments}
                    user={this.props.user}
                  />
                ))
              : undefined}
          </CardContent>
        </Card>
      );
    }
  }
  render() {
    const {classes} = this.props;
    let allView = this.generateView(undefined);
    let myView = this.generateView(this.props.user.user._id);
    let officialView = this.generateView('6078e9a0b3d8f82df8987f1e');
    let demoView;
    if (this.state.tabSelected === 0) {
      demoView = allView;
    } else if (this.state.tabSelected === 1) {
      demoView = myView;
    } else {
      demoView = officialView;
    }

    return (
      <div align="center">
        <div id="square_banner" className={classes.section}>
          <br />
          <br />
          <Typography variant="h1" className={classes.heading}>
            Moments
          </Typography>
        </div>
        <Tabs
          value={this.state.tabSelected}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
          aria-label="disabled tabs example"
          centered
        >
          <Tab label="All" index={0} />
          <Tab label="My Moments" index={1} />
          <Tab label="Official Moments" index={2} />
        </Tabs>

        <div style={{width: '80%'}}>{demoView}</div>

        <div style={{position: 'fixed', right: '20px', bottom: '20px'}}>
          <Fab
            color="primary"
            style={{marginRight: '15px', background: '#08D390'}}
            onClick={this.scrollUp}
          >
            <UpToTop />
          </Fab>
          <Fab
            color="primary"
            style={{marginRight: '15px', background: '#F75F91'}}
            onClick={this.scrollDown}
          >
            <DownToBottom />
          </Fab>
          <Fab color="secondary" onClick={this.refreshPage}>
            <RefreshIcon />
          </Fab>
        </div>
        {this.state.snackbar}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Moment)));

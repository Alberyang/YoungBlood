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
    marginLeft: '20px',
    width: '100%',
  },
});

class Moment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moments: undefined,
      tabSelected: 0,
    };
    this.fetchMoments();
  }

  async fetchMoments() {
    const response = await axios.get(`/moment`);
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

  componentDidMount() {
    const response = this.fetchMoments();
    response.then((res) => {
      this.setState({moments: res.data.moments});
    });
  }
  generateView(filter_id) {
    const {classes} = this.props;
    if (!filter_id) {
      return (
        <>
          <MomentBox />
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
            return item.user_id === this.props.user.user._id;
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
    const mockFriends = [
      {user_id: '123', username: 'Frank'},
      {user_id: '234', username: 'Jack'},
      {user_id: '333', username: 'Owen'},
      {user_id: '444', username: 'Alan'},
    ];
    let allView = this.generateView(undefined);
    let myView = this.generateView(this.props.user.user._id);
    let officialView = this.generateView('606c453064ad461348e31a23');
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
            Square
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
          <Tab label="All" />
          <Tab label="My Moments" />
          <Tab label="Official Moments" />
        </Tabs>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div style={{width: '70%'}}>{demoView}</div>
          <Card style={{width: '20%', marginTop: '20px', marginLeft: '50px'}}>
            <CardContent>
              <MenuList>
                <h1>Contacts</h1>
                {mockFriends.map((item, index) => {
                  return (
                    <div key={index}>
                      <Divider />
                      <MenuItem>
                        {item.username}
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          style={{marginLeft: 'auto'}}
                        >
                          Message
                        </Button>
                      </MenuItem>
                      <Divider />
                    </div>
                  );
                })}
              </MenuList>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Moment)));

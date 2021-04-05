import React, {Component} from 'react';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import {fetchMoment} from '../../../actions/momentAction';
import MomentBox from './MomentBox';
import MomentCard from './MomentCard';
import EmojiPicker from './Emoji';
import Posts from './test.jsx';

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
    width: '70%',
  },
});

class Moment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moments: [
        {
          user: 'Yichao Xu1',
          time: '2021-03-20 18:00',
          contents: '我惠天下第一~',
          comments: [
            {user: 'Yichao Xu2', time: '2021-03-20 19:00', contents: '赞同'},
            {user: 'Yichao Xu3', time: '2021-03-21 20:00', contents: '+1'},
          ],
          pic_src: ['1.jpg'],
        },
        {
          user: 'Yichao Xu2',
          time: '2021-03-30 19:00',
          contents: '惠惠惠惠惠',
          comments: [
            {user: 'Yichao Xu2', time: '2021-03-31 19:00', contents: '赞同'},
            {user: 'Yichao Xu3', time: '2021-03-31 20:00', contents: '+1'},
          ],
          pic_src: ['1.jpg', '2.jpg'],
        },
      ],
    };
  }
  componentDidMount() {
    this.props.dispatch(fetchMoment());
  }
  render() {
    const {classes} = this.props;
    const moments = this.props.moment.moments;
    let mainMomentCard;
    if (moments) {
      mainMomentCard = (
        <div>
          {moments.map((item, index) => (
            <MomentCard key={index} moment={item} />
          ))}
        </div>
      );
    } else {
      mainMomentCard = (
        <div>
          {this.state.moments.map((item, index) => (
            <MomentCard key={index} moment={item} />
          ))}
        </div>
      );
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
        <MomentBox />
        <Card className={classes.moments}>
          <CardContent id="moment_card">{mainMomentCard}</CardContent>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Moment)));

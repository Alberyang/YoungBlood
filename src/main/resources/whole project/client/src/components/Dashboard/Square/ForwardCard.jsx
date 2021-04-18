import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MessageIcon from '@material-ui/icons/Message';
import CloseIcon from '@material-ui/icons/Close';
import Gallery from 'react-grid-gallery';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MsgBar from './MessageBar';
import axios from '../../../helpers/axiosConfig';

import CommentCard from './CommentCard';
import CommentBox from './CommentBox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import EmojiPicker from './Emoji';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    position: 'relative',
    margin: '20px auto',
  },
  moment_img: {
    position: 'relative',
    marginTop: '20px',
    marginBottom: '20px',
    width: '80%',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function MomentCard(props) {
  const classes = useStyles();

  let initialAvatar = (
    <Avatar aria-label="recipe" className={classes.avatar}>
      {props.moment.username[0]}
    </Avatar>
  );

  const [avatar, setAvatar] = React.useState(initialAvatar);
  const getAvatar = async () => {
    const response = await axios.get(`/avatar`);
    return response;
  };

  React.useEffect(() => {
    const response = getAvatar();
    response.then((res) => {
      let avatarName = res.data.files[res.data.files.length - 1].filename;
      setAvatar(<Avatar alt="Nothing Here" src={'/api/image/' + avatarName} />);
    });
  }, []);

  const dateFormat = (fmt, date) => {
    let ret;
    const opt = {
      'Y+': date.getFullYear().toString(),
      'm+': (date.getMonth() + 1).toString(),
      'd+': date.getDate().toString(),
      'H+': date.getHours().toString(),
      'M+': date.getMinutes().toString(),
      'S+': date.getSeconds().toString(),
    };
    for (let k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
        );
      }
    }
    return fmt;
  };

  const thumbnailStyle = () => {
    return {
      border: '1px solid grey',
      height: '178px',
      width: 'auto',
    };
  };

  const getPhoto = (elem) => {
    return {
      src: elem,
      thumbnail: elem,
      thumbnailWidth: 'auto',
      thumbnailHeight: 180,
    };
  };

  let photodata = undefined;
  if (props.moment.images.length > 0) {
    let photos = props.moment.images.map(getPhoto);
    photodata = (
      <CardMedia className={classes.moment_img}>
        <Gallery images={photos} thumbnailStyle={thumbnailStyle} />
      </CardMedia>
    );
  }

  return (
    <>
      <Card className={classes.root} variant="outlined">
        <CardHeader
          align="left"
          avatar={avatar}
          title={props.moment.username}
          subheader={dateFormat(
            'YYYY-mm-dd HH:MM:SS',
            new Date(parseInt(props.moment.createDate) * 1000)
          )}
        />
        <CardContent align="left">
          <Typography variant="body2" color="textSecondary" component="p">
            {props.moment.contents}
          </Typography>
          <div
            style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column'}}
          >
            {photodata}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

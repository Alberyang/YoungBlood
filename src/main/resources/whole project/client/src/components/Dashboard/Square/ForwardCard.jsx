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
    width: '100%',
    marginTop: '20px',
    position: 'relative',
  },
  moment_img: {
    position: 'relative',
    margin: '0 20px',
    width: '80%',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  forward_textarea: {
    width: '100%',
  },
}));

export default function MomentCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [loadingFlag, setLoaded] = React.useState(true);
  const [comments, updateComments] = React.useState(props.moment.comments);
  const [likeNumber, setLikeNumber] = React.useState(props.moment.like.length);
  const [likeState, setLike] = React.useState(
    props.moment.like.indexOf(props.user.user._id) === -1 ? 'disliked' : 'liked'
  );
  const [snackbar, setSnackbar] = React.useState(undefined);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const inputRef = React.useRef(undefined);

  let initialAvatar = (
    <Avatar aria-label="recipe" className={classes.avatar}>
      {props.moment.user[0]}
    </Avatar>
  );

  const [avatar, setAvatar] = React.useState(initialAvatar);
  const getAvatar = async () => {
    const response = await axios.get(`/avatar`);
    return response;
  };

  const [forwardBoxOpen, setForwardBox] = React.useState(false);
  const [emojiExpand, setEmojiExpand] = React.useState(false);

  React.useEffect(() => {
    const response = getAvatar();
    response.then((res) => {
      let avatarName = res.data.files[res.data.files.length - 1].filename;
      setAvatar(<Avatar alt="Nothing Here" src={'/api/image/' + avatarName} />);
    });
  }, []);

  let likeBtn =
    likeState === 'disliked' ? (
      <FavoriteIcon />
    ) : (
      <FavoriteIcon style={{color: 'red'}} />
    );

  const thumbnailStyle = () => {
    return {
      border: '1px solid grey',
      height: '178px',
      width: 'auto',
    };
  };

  const handleClose = (deleteFlag) => {
    setDialogOpen(false);
    if (deleteFlag) {
      setSnackbar(
        <MsgBar msg="Successfully deleting a moment!" severity="success" />
      );
      setTimeout(() => setSnackbar(undefined), 3 * 1000);
      let response = deleteOneMoment(props.moment.moment_id);
    }
  };

  const handleForwardClose = (forwardFlag) => {
    setForwardBox(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getPhoto = (elem) => {
    return {
      src: '/api/image/' + elem,
      thumbnail: '/api/image/' + elem,
      thumbnailWidth: 'auto',
      thumbnailHeight: 180,
    };
  };

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

  const postLike = async (data, moment_id) => {
    const response = await axios
      .post(`/moment/like/${moment_id}`, data)
      .then((res) => {
        setLike(data.operation + 'd');

        setLikeNumber(
          data.operation === 'dislike' ? likeNumber - 1 : likeNumber + 1
        );
      });
    return response;
  };

  const publicLike = () => {
    let nextOperation = likeState === 'disliked' ? 'like' : 'dislike';
    let response = postLike({operation: nextOperation}, props.moment.moment_id);
  };

  const deleteOneMoment = async (moment_id) => {
    const response = await axios.delete(`/moment/${moment_id}`).then((res) => {
      let newMoments = props.momentList.filter((item) => {
        return item.moment_id !== props.moment.moment_id;
      });
      props.updateMoments(newMoments);
    });
    return response;
  };

  const deleteMoment = () => {
    setDialogOpen(true);
  };

  let photodata = undefined;
  if (props.moment.images.length > 0) {
    let photos = props.moment.images.map(getPhoto);
    // let waitingFlag = loadingFlag ? (
    //   <CircularProgress style={{position: 'absolute', top: '50%'}} />
    // ) : undefined;
    photodata = (
      <CardMedia className={classes.moment_img}>
        <Gallery images={photos} thumbnailStyle={thumbnailStyle} />
      </CardMedia>
    );
    setTimeout(() => setLoaded(false), 10 * 1000);
  }

  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          align="left"
          avatar={avatar}
          title={props.moment.user}
          subheader={dateFormat(
            'YYYY-mm-dd HH:MM:SS',
            new Date(props.moment.time)
          )}
        />
        <CardContent align="left">
          <Typography variant="body2" color="textSecondary" component="p">
            {props.moment.contents}
          </Typography>

          <IconButton
            style={{position: 'absolute', top: '5px', right: '10px'}}
            size="small"
            aria-label="close"
            color="inherit"
            onClick={deleteMoment}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </CardContent>
        <div
          style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column'}}
        >
          {photodata}
          <CardActions align="left">
            <IconButton aria-label="add to favorites" onClick={publicLike}>
              {likeBtn}
            </IconButton>
            {likeNumber}
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="comment"
            >
              <MessageIcon />
            </IconButton>
            {comments.length}
            <IconButton aria-label="share" onClick={() => setForwardBox(true)}>
              <ShareIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {comments.map((comment, index) => {
                return (
                  <React.Fragment key={index}>
                    <CommentCard
                      moment_id={props.moment.moment_id}
                      commentList={comments}
                      comment={comment}
                      updateComments={updateComments}
                    />
                    <Divider variant="middle" />
                  </React.Fragment>
                );
              })}
              <CommentBox
                moment_id={props.moment.moment_id}
                comments={comments}
                updateComments={updateComments}
              />
            </CardContent>
          </Collapse>
        </div>
      </Card>
      {snackbar}
      <Dialog
        fullWidth={true}
        open={dialogOpen}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{'WARNING'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {'Do you want to delete this moment?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleClose(true)} style={{color: 'red'}}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth={true}
        open={forwardBoxOpen}
        onClose={() => handleForwardClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{'MOMENT FORWARD'}</DialogTitle>
        <DialogContent>
          <TextField
            align="center"
            className={classes.forward_textarea}
            inputRef={inputRef}
            id="forward_moment_textarea"
            rows={5}
            label="Forward a moment..."
            placeholder="What's happening?"
            multiline
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <IconButton
            aria-label="insert a emoji"
            onClick={() => setEmojiExpand(!emojiExpand)}
            aria-expanded={emojiExpand}
            style={{marginRight: 'auto'}}
          >
            <EmojiEmotionsIcon />
          </IconButton>
          <Button color="primary">Cancel</Button>
          <Button color="primary">Forward</Button>
        </DialogActions>
        <Collapse in={emojiExpand}>
          <EmojiPicker node={inputRef.current} />
        </Collapse>
      </Dialog>
    </>
  );
}

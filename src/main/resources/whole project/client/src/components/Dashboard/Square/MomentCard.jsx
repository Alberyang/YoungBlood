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
import Picker from 'emoji-picker-react';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Pagination from '@material-ui/lab/Pagination';
import ForwardCard from './ForwardCard';

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

export const themeContext = React.createContext(null);

export default function MomentCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [comments, updateComments] = React.useState(props.moment.comments);
  const [likeState, setLike] = React.useState(
    props.moment.like.indexOf(props.user.user._id) === -1 ? 'disliked' : 'liked'
  );
  const [snackbar, setSnackbar] = React.useState(undefined);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const inputRef = React.useRef(undefined);
  const updateView = React.useState()[1];

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

  const [forwardBoxOpen, setForwardBox] = React.useState(false);
  const [emojiExpand, setEmojiExpand] = React.useState(false);
  const [currentPage, setPage] = React.useState(1);

  React.useEffect(() => {
    const response = getAvatar();
    response.then((res) => {
      if (res.data.files) {
        let avatarName = res.data.files[res.data.files.length - 1].filename;
        setAvatar(
          <Avatar alt="Nothing Here" src={'/api/image/' + avatarName} />
        );
      }
    });
  }, []);

  let likeBtn =
    props.moment.like.indexOf(props.user.user._id) === -1 ? (
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
      let response = deleteOneMoment(props.moment.id);
    }
  };

  const handleForwardClose = (forwardFlag) => {
    setForwardBox(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const pageChange = (event, page) => {
    setPage(page);
  };

  const getPhoto = (elem) => {
    return {
      src: elem,
      thumbnail: elem,
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
      .post(
        `http://121.4.57.204:8080/info/${data.operation}/${props.user.user._id}/${moment_id}`,
        data
      )
      .then((res) => {
        setLike(data.operation + 'd');
        let momentIndex = props.momentList.findIndex(
          (item) => item.id === props.moment.id
        );
        if (data.operation === 'like') {
          props.momentList[momentIndex].like.push(props.user.user._id);
        } else {
          let likeId = props.momentList[momentIndex].like.indexOf(
            props.user.user._id
          );
          props.momentList[momentIndex].like.splice(likeId, 1);
        }
        props.updateMoments(props.momentList);
      });
    return response;
  };

  const publicLike = () => {
    let nextOperation = likeState === 'disliked' ? 'like' : 'dislike';
    let response = postLike({operation: nextOperation}, props.moment.id);
  };

  const deleteOneMoment = async (moment_id) => {
    const response = await axios
      .delete(`http://121.4.57.204:8080/info/${moment_id}`)
      .then((res) => {
        setSnackbar(
          <MsgBar msg="Successfully deleting a moment!" severity="success" />
        );
        setTimeout(() => setSnackbar(undefined), 5 * 1000);
        let newMoments = props.momentList.filter((item) => {
          return item.id !== props.moment.id;
        });
        props.updateMoments(newMoments);
      });
    return response;
  };

  const deleteMoment = () => {
    setDialogOpen(true);
  };

  const onEmojiClick = (event, emojiObject) => {
    if (inputRef.current) {
      let start_pos = inputRef.current.selectionStart;
      let prev_part =
        inputRef.current.value.substring(0, inputRef.current.selectionStart) +
        emojiObject.emoji;
      let after_part = inputRef.current.value.substring(
        inputRef.current.selectionStart
      );
      inputRef.current.value = prev_part + after_part;
      inputRef.current.selectionStart = start_pos + 2;
      inputRef.current.selectionEnd = start_pos + 2;
      inputRef.current.focus();
    }
  };

  const forwardDefaultContents = () => {
    if (
      props.moment.hasOwnProperty('forwards') &&
      props.moment.forwards.length > 0
    ) {
      let forwardStr = '';
      props.moment.forwards.map((item) => {
        forwardStr += `//@${item.username}:${item.contents}`;
      });
      return forwardStr;
    } else {
      return '';
    }
  };

  const postForwardMoment = async (data) => {
    const formData = new FormData();
    formData.append('contents', data.contents);
    formData.append('infoId', data.infoId);
    const response = await axios
      .post(
        'http://121.4.57.204:8080/info/share/606c453064ad461348e31a23',
        formData
      )
      .then((res) => {
        setSnackbar(
          <MsgBar msg="Successfully forward a moment!" severity="success" />
        );
        setTimeout(() => setSnackbar(undefined), 3 * 1000);
        let newMoment = res.data.data;
        props.momentList.unshift(newMoment);
        props.updateMoments(props.momentList);
      });
    return response;
  };

  const forwardOneMoment = () => {
    const text = inputRef.current.value;
    if (text === '') {
      setSnackbar(<MsgBar msg="Please input something!" severity="error" />);
      setTimeout(() => setSnackbar(undefined), 3 * 1000);
      return;
    }
    let infoId =
      props.moment.hasOwnProperty('ori_info') && props.moment.ori_info
        ? props.moment.ori_info.id
        : props.moment.id;
    let momentData = {
      contents: text,
      infoId: infoId,
    };
    setForwardBox(false);
    postForwardMoment(momentData);
  };

  let photodata = undefined;
  if (props.moment.hasImage) {
    let photos = props.moment.images.map(getPhoto);
    photodata = (
      <CardMedia className={classes.moment_img}>
        <Gallery
          backdropClosesModal={true}
          images={photos}
          thumbnailStyle={thumbnailStyle}
        />
      </CardMedia>
    );
  }

  return (
    <>
      <Card className={classes.root}>
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
          {props.moment.isShare ? (
            <ForwardCard moment={props.moment.ori_info} />
          ) : undefined}
          <CardActions align="left">
            <IconButton aria-label="add to favorites" onClick={publicLike}>
              {likeBtn}
            </IconButton>
            {props.moment.like.length}
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="comment"
            >
              <MessageIcon />
            </IconButton>
            {props.moment.comments.length}
            <IconButton aria-label="share" onClick={() => setForwardBox(true)}>
              <ShareIcon />
            </IconButton>
            {props.moment.hasOwnProperty('shares') ? props.moment.shares : 0}
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <themeContext.Provider value={{updateComments, updateView}}>
                {props.moment.comments.map((comment, index) => {
                  return index >= (currentPage - 1) * 4 &&
                    index < currentPage * 4 ? (
                    <React.Fragment key={index}>
                      <CommentCard
                        moment_id={props.moment.id}
                        comment={comment}
                        comments={props.moment.comments}
                      />
                      <Divider variant="middle" />
                    </React.Fragment>
                  ) : undefined;
                })}

                {Math.ceil(props.moment.comments.length / 4) > 1 ? (
                  <Pagination
                    color="primary"
                    style={{marginTop: '20px', display: 'inline-block'}}
                    count={Math.ceil(props.moment.comments.length / 4)}
                    onChange={pageChange}
                    showFirstButton
                    showLastButton
                  />
                ) : undefined}

                <CommentBox
                  moment_id={props.moment.id}
                  comments={props.moment.comments}
                  setExpanded={setExpanded}
                  updateComments={updateComments}
                  updateView={updateView}
                />
              </themeContext.Provider>
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
            inputProps={{
              defaultValue: forwardDefaultContents(),
            }}
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
          <Button color="primary" onClick={() => handleForwardClose(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={forwardOneMoment}>
            Forward
          </Button>
        </DialogActions>
        <Collapse in={emojiExpand}>
          <Picker onEmojiClick={onEmojiClick} />
        </Collapse>
      </Dialog>
    </>
  );
}

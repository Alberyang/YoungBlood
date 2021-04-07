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
import PhotoGallery from './PhotoGallery';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from '../../../helpers/axiosConfig';

import CommentCard from './CommentCard';
import CommentBox from './CommentBox';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    marginTop: '20px',
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

  let likeBtn =
    likeState === 'disliked' ? (
      <FavoriteIcon />
    ) : (
      <FavoriteIcon style={{color: 'red'}} />
    );

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getPhoto = (elem) => {
    return {
      src: '/api/image/' + elem,
      width: 1,
      height: 1,
    };
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

  let photodata = undefined;
  if (props.moment.images.length > 0) {
    let photos = props.moment.images.map(getPhoto);
    // photos = photos.concat(props.moment.images.map(getPhoto));
    let waitingFlag = loadingFlag ? (
      <CircularProgress style={{position: 'absolute', top: '50%'}} />
    ) : undefined;
    photodata = (
      <CardMedia className={classes.moment_img} onLoad={() => setLoaded(false)}>
        {waitingFlag}
        <PhotoGallery photos={photos} />
      </CardMedia>
    );
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        align="left"
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        title={props.moment.user}
        subheader={
          props.moment.time.split('T')[0] +
          ' ' +
          props.moment.time.split('T')[1].split('.')[0]
        }
      />
      <CardContent align="left">
        <Typography variant="body2" color="textSecondary" component="p">
          {props.moment.contents}
        </Typography>
      </CardContent>
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
        {props.moment.comments.length}
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {props.moment.comments.map((comment, index) => {
            return (
              <React.Fragment key={index}>
                <CommentCard comment={comment} />
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
    </Card>
  );
}

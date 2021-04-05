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
import Gallery from 'react-grid-gallery';

import CommentCard from './CommentCard';
import CommentBox from './CommentBox';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    marginTop: '20px',
  },
  moment_img: {
    margin: '0 20px',
    height: '200px',
    width: 'auto',
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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // const photodata = props.moment.pic_src.map(getPhoto);

  // function getPhoto(url) {
  //   return {
  //     src: require("../../../img/test-img/" + url),
  //     thumbnail: require("../../../img/test-img/" + url),
  //     thumbnailWidth: "auto",
  //     thumbnailHeight: 150,
  //   };
  // }

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
        subheader={props.moment.time}
      />
      <CardContent align="left">
        <Typography variant="body2" color="textSecondary" component="p">
          {props.moment.contents}
        </Typography>
      </CardContent>
      {/* <CardMedia className={classes.moment_img}>
        <Gallery images={photodata} />
      </CardMedia> */}
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        {props.moment.like}
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

          <CommentBox />
        </CardContent>
      </Collapse>
    </Card>
  );
}

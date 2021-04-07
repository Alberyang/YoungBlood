import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function CommentCard(props) {
  const classes = useStyles();
  console.log(props.comment);
  return (
    <Card className={classes.root} style={{border: 'none', boxShadow: 'none'}}>
      <CardHeader
        align="left"
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        title={props.comment.username}
        subheader={
          props.comment.createdAt.split('T')[0] +
          ' ' +
          props.comment.createdAt.split('T')[1].split('.')[0]
        }
      />
      <CardContent align="left">
        <Typography variant="body2" color="textSecondary" component="p">
          {props.comment.contents}
        </Typography>
      </CardContent>
    </Card>
  );
}

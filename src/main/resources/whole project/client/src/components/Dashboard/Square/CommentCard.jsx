import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import axios from '../../../helpers/axiosConfig';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MsgBar from './MessageBar';

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
          ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
        );
      }
    }
    return fmt;
  };

  let initialAvatar = (
    <Avatar aria-label="recipe" className={classes.avatar}>
      {props.comment.username[0]}
    </Avatar>
  );

  const [avatar, setAvatar] = React.useState(initialAvatar);
  const [snackbar, setSnackbar] = React.useState(undefined);

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

  const deleteOneComment = async (moment_id, comment_id) => {
    const response = await axios
      .delete(`/moment/comment/${moment_id}/${comment_id}`)
      .then((res) => {
        let newComments = props.commentList.filter((item) => {
          return item._id !== comment_id;
        });
        setSnackbar(
          <MsgBar msg="Successfully deleting the comment!" severity="success" />
        );
        setTimeout(() => setSnackbar(undefined), 3 * 1000);
        // deep copy
        props.updateComments(newComments);
      });
    return response;
  };

  const deleteComment = () => {
    let response = deleteOneComment(props.moment_id, props.comment._id);
  };

  return (
    <div>
      <Card
        className={classes.root}
        style={{border: 'none', boxShadow: 'none', position: 'relative'}}
      >
        <CardHeader
          align="left"
          avatar={avatar}
          title={props.comment.username}
          subheader={dateFormat(
            'YYYY-mm-dd HH:MM:SS',
            new Date(props.comment.createdAt)
          )}
        />
        <CardContent align="left">
          <Typography variant="body2" color="textSecondary" component="p">
            {props.comment.contents}
          </Typography>
          <IconButton
            style={{position: 'absolute', top: '10px', right: '0px'}}
            size="small"
            aria-label="close"
            color="inherit"
            onClick={deleteComment}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </CardContent>
      </Card>
      {snackbar}
    </div>
  );
}

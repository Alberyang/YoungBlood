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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {themeContext} from './MomentCard';

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
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const getAvatar = async () => {
    const response = await axios.get(`/avatar`);
    return response;
  };

  const {updateComments, updateView} = React.useContext(themeContext);

  React.useEffect(() => {
    const response = getAvatar();
    response.then((res) => {
      let avatarName = res.data.files[res.data.files.length - 1].filename;
      setAvatar(<Avatar alt="Nothing Here" src={'/api/image/' + avatarName} />);
    });
  }, []);

  const deleteOneComment = async (comment_id) => {
    const response = await axios
      .delete(`http://121.4.57.204:8080/info/review/${comment_id}`)
      .then((res) => {
        setSnackbar(
          <MsgBar msg="Successfully deleting a comment!" severity="success" />
        );
        setTimeout(() => setSnackbar(undefined), 5 * 1000);
        let index = 0;
        for (let key in props.comments) {
          if (props.comments[key].id === comment_id) {
            index = key;
            break;
          }
        }
        props.comments.splice(index, 1);
        // shallow copy and force update
        updateComments(props.comments);
        updateView(1);
        updateView(0);
      });
    return response;
  };

  const handleClose = (deleteFlag) => {
    setDialogOpen(false);
    if (deleteFlag) {
      let response = deleteOneComment(props.comment.id);
    }
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
            new Date(parseInt(props.comment.createDate) * 1000)
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
            onClick={() => setDialogOpen(true)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </CardContent>
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
            {'Do you want to delete this comment?'}
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
    </div>
  );
}

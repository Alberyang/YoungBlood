import React, {Fragment} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default function EditDocument(props) {
  const [open, setOpen] = React.useState(false);
  const [update, setUpdate] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    setUpdate(false);
  };

  return (
    <Fragment>
      <IconButton aria-label="edit">
        <EditIcon onClick={handleClickOpen} />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={() => props.onEdit(props.id)} name="editTitle">
          <DialogTitle id="form-dialog-title">Edit this document</DialogTitle>
          <DialogContent>
            <DialogContentText>
              PDF-type documents only. If document does not appear, please
              reload the page.
            </DialogContentText>
            <TextField
              autoComplete="off"
              autoFocus
              name="title"
              margin="dense"
              id="title"
              label="File Title"
              fullWidth
              variant="filled"
            />
            <br />
            <br />
          </DialogContent>
          <DialogActions>
            <label htmlFor="uploadPDFDocument">
              <Button
                type="submit"
                onClick={() => {
                  setUpdate(true);
                  handleClose();
                }}
              >
                Update
              </Button>
            </label>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
      {update ? (
        <Snackbar open autoHideDuration={4000} onClose={handleAlert}>
          <Alert onClose={handleAlert} severity="success" variant="filled">
            PDF was successfully updated!
          </Alert>
        </Snackbar>
      ) : null}
    </Fragment>
  );
}

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default function AddDocument(props) {
  const [open, setOpen] = React.useState(false);
  const [create, setCreate] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setCreate(false);
  };

  return (
    <div>
      {create ? (
        <Snackbar open autoHideDuration={4000} onClose={handleAlert}>
          <Alert onClose={handleAlert} severity="success" variant="filled">
            PDF was successfully uploaded!
          </Alert>
        </Snackbar>
      ) : null}
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        style={{margin: '20px 0 20px 0'}}
      >
        Add a personal document
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={props.onFormSubmitPDF}>
          <DialogTitle id="form-dialog-title">Create a document</DialogTitle>
          <DialogContent>
            <DialogContentText>
              PDF-type documents only. If document does not appear, please
              reload the page.
            </DialogContentText>
            <TextField
              autoFocus
              name="title"
              margin="dense"
              id="title"
              label="File Title"
              fullWidth
              variant="filled"
              autoComplete="off"
            />
            <br />
            <br />
            <input
              accept="application/pdf"
              type="file"
              name="file"
              onChange={props.onChange}
            />
            Is Resume?
            <input type="checkbox" id="isResume" />
          </DialogContent>
          <DialogActions>
            <label htmlFor="uploadPDFDocument">
              <Button
                type="submit"
                onClick={() => {
                  setCreate(true);
                  handleClose();
                }}
                color="primary"
              >
                Upload
              </Button>
            </label>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

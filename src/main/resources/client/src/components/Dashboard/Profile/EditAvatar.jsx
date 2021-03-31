import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

export default function EditAvatar(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div>
      <MenuItem onClick={handleClickOpen}>Edit Avatar</MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={props.onFormSubmit}>
          <DialogTitle id="form-dialog-title">
            Add a new profile avatar
          </DialogTitle>
          <DialogContent>
            <Input
              type="file"
              name="file"
              inputProps={{accept: 'image/*'}}
              onChange={props.onChange}
              color="primary"
            />
          </DialogContent>
          <DialogActions>
            <label htmlFor="uploadPDFDocument">
              <Button type="submit" color="primary" onClick={handleClose}>
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

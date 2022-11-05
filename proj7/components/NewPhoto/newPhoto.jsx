import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';

export default function NewPhoto() {
  const [open, setOpen] = React.useState(false);
  const [uploadInput, setUploadInput] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);

    if (uploadInput) {

     // Create a DOM form and add the file to it under the name uploadedphoto
     const domForm = new FormData();
     domForm.append('uploadedphoto', uploadInput);
     axios.post('/photos/new', domForm)
       .then((res) => {
         console.log(res);
       })
       .catch(err => console.log(`POST ERR: ${err}`));
    }
    };

    const handleChange = (e) => {
        setUploadInput(e.target.files[0]);
    };


  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        new photo
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Photo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select your new photo file
          </DialogContentText>
          <input type="file" accept="image/*" onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="secondary">
            submit new photo
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

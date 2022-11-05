import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {InputLabel, Input} from '@material-ui/core';
import axios from 'axios';

export default function NewPhotoComment(props) {
  const [open, setOpen] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleSubmit = () => {
    setOpen(false);
    const formData = new FormData();
    formData.append('comment', newComment);

    axios.post(`/commentsOfPhoto/${props.photoId}`, formData)
    .catch(err => {
        console.log(err);
        setNewComment('');
    });

    
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        new comment
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write down your new comment
          </DialogContentText>
          <InputLabel htmlFor="new-comment">Comment Content</InputLabel>
          <Input id="new-comment" value={newComment} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            submit new comment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

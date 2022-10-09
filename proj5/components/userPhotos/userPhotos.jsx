import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Grid,
  CardMedia,
} from '@material-ui/core';
import './userPhotos.css';
import fetchModel from '../../lib/fetchModelData';

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.user = null;

    fetchModel(`http://localhost:3000/photosOfUser/${this.props.match.params.userId}`)
    .then(res => {
      this.user = res.data;
      return fetchModel(`http://localhost:3000/user/${this.props.match.params.userId}`);
    })
    .then(res => {
      this.name = res.data.first_name + ' ' + res.data.last_name;
      this.props.changeContext('photo',this.name);
    })
    .catch(err => console.log(err));
  }


  render() {
    if (!this.user) {
      return '';
    }
    let photos = this.user.map(
      photo => (
      <Grid item sx={6} key={photo._id}>
        <Card >
          <CardContent>
            <CardMedia
              component='img'
              width='200'
              height='200'
              image={`/images/${photo.file_name}`}
            />
            <Typography gutterBottom variant="h5" component="div">
              {"Photographed in " + photo.date_time}
            </Typography>
            <List>
              {photo.comments ? photo.comments.map(comment=> (
              <ListItem key={comment._id}>
                <Typography>
                  <Typography variant="body1">
                    {comment.user.first_name + ' ' + comment.user.last_name} says:
                  </Typography>
                  <Typography variant="body2">
                    {comment.comment}
                  </Typography>
                  <Typography variant="caption">
                    written in {comment.date_time}
                  </Typography>
                </Typography>
                <Divider/>
              </ListItem>
            )) : null}
            </List>
          </CardContent>
        </Card>
      </Grid>
      )
    );

    
    return (
      <Grid container justifyContent="space-evenly" alignItems="flex-start" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">
            {this.name} &apos;s photos
          </Typography>
        </Grid>
        {photos}
      </Grid>
      

    );
  }
}
export default UserPhotos;

import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';
import {Link}from 'react-router-dom';
import './userDetail.css';
import axios from 'axios';


/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    this.user = null; 
    axios.get(`/user/${this.props.match.params.userId}`)
    .then(res => {
      this.user = res.data;
      this.props.changeContext({view:'user', user:this.user.first_name + " " + this.user.last_name});
    })
    .catch(err => console.log(err));
  }


  render() {
    if (!this.user) {
      return '';
    }      
    return (
      <Card>
        <CardContent>
          <h2>
            {this.user.first_name + " " + this.user.last_name}
          </h2>
          <List>
            <ListItem>
              <ListItemText primary={`Location: ${this.user.location}`}/>
            </ListItem>
            <Divider/>
            <ListItem>
              <ListItemText primary={`Occupation: ${this.user.occupation}`}/>
            </ListItem>
            <Divider/> 
            <ListItem>
              <ListItemText primary={`Description: ${this.user.description}`}/>
            </ListItem>
            <Divider/>
          </List>

        </CardContent>
        <CardActions>
          <Link to={`/photos/${this.user._id}`}>
            <Button>details</Button>
          </Link> 
        </CardActions>
      </Card>
      
      
    );
  }
}
export default UserDetail;

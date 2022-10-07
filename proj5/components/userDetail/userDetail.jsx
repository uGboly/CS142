import React from 'react';
import {
  Typography,
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


/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: window.cs142models.userModel(this.props.match.params.userId)
    };
  }

  render() {
    return (
      <Card>
          <CardContent>
            <h2>
              {this.state.user.first_name + " " + this.state.user.last_name}
            </h2>
            <List>
              <ListItem>
                <ListItemText primary={`Location: ${this.state.user.location}`}/>
              </ListItem>
              <Divider/>
              <ListItem>
                <ListItemText primary={`Occupation: ${this.state.user.occupation}`}/>
              </ListItem>
              <Divider/> 
              <ListItem>
                <ListItemText primary={`Description: ${this.state.user.description}`}/>
              </ListItem>
              <Divider/>
            </List>

          </CardContent>
          <CardActions>
            <Link to={`/photos/${this.state.user._id}`}>
              <Button>details</Button>
            </Link> 
          </CardActions>
      </Card>
    );
  }
}

export default UserDetail;

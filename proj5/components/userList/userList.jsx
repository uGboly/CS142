import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Link,
}
from '@material-ui/core';
import {Link as RouterLink}from 'react-router-dom';
import './userList.css';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: window.cs142models.userListModel()
    };
  }

  render() {
    let userList = this.state.users.map(
      user =><Link key={user._id} component={RouterLink} to={`/users/${user._id}`}><ListItem> <ListItemText primary={user.first_name + ' ' + user.last_name}/> </ListItem><Divider /></Link>
    );
    return (
      <div>
          <List component="nav">
          {userList}
          </List>
        
      </div>
    );
  }
}

export default UserList;

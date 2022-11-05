import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, ButtonGroup
} from '@material-ui/core';
import './TopBar.css';
import axios from 'axios';
import NewPhoto from '../NewPhoto/newPhoto';
/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {versionToDisplay : null};
    this.handleClick = this.handleClick.bind(this);

    axios.get('http://localhost:3000/test/info')
    .then(res => {
      this.setState({
        versionToDisplay : res.data.__v
      });
    })
    .catch(err => console.log(err));
  }


  handleClick () {
    axios.post('admin/logout')
    .then(() => {
      this.props.changeContext({
        loggedUser:null
      });
    })
    .catch(err => console.log(err));
  }

  render() {
    let right = (
      <Typography className='right' variant="h5" color="inherit">
        {this.props.view === 'photo' ? 'Photos of ' : ''}
        {this.props.user ? this.props.user : ''}
      </Typography>
    );

    let logout = (
    <ButtonGroup variant="contained" aria-label="outlined secondary button group">
      <Button component="button" onClick={this.handleClick}>logout</Button>;
      <NewPhoto/>
    </ButtonGroup>
    );

    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="toptoolbar" spacing ={3}>
          <Typography variant="h5" color="inherit">
            Zhang Lin     version : {this.state.versionToDisplay ?? '' }
          </Typography>

          <Typography variant="h5" color="inherit">
            {this.props.loggedUser ? `hi ${this.props.loggedUser}` : ''}
          </Typography>
          {this.props.loggedUser ? logout : ''}
          {right}
        </Toolbar>
      </AppBar>
    );
  }
}
export default TopBar;

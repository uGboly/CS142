import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';
import axios from 'axios';
/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {versionToDisplay : null};

    axios.get('http://localhost:3000/test/info')
    .then(res => {
      this.setState({
        versionToDisplay : res.data.__v
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

    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit">
            Zhang Lin     version : {this.state.versionToDisplay ?? '' }
          </Typography>
          {right}
        </Toolbar>
      </AppBar>
    );
  }
}
export default TopBar;

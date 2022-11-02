import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
  Grid, Typography, Paper
} from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from './components/LoginRegister/LoginRegister';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.changeContext = this.changeContext.bind(this);

    this.state = {
      view:'home',
      user:null,
      loggedUser:null
    };
  }

  changeContext(view, user, loggedUser){
    this.setState({view, user, loggedUser});
  }

  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
        <TopBar view={this.state.view} user={this.state.user} loggedUser={this.state.loggedUser}/>
        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper className="cs142-main-grid-item">
            <UserList />
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="cs142-main-grid-item">
            <Switch>
            <Route exact path="/"
                render={() => (
                <Typography variant="body1">
                  Welcome to your photosharing app! This <a href="https://mui.com/components/paper/">Paper</a> component
                  displays the main content of the application. The {"sm={9}"} prop in
                  the <a href="https://mui.com/components/grid/">Grid</a> item component makes it responsively
                  display 9/12 of the window. The Switch component enables us to conditionally render different
                  components to this part of the screen. You don&apos;t need to display anything here on the homepage,
                  so you should delete this Route component once you get started.
                </Typography>
                )}
              />
              
              <Route path="/login-register" render={ props => <LoginRegister {...props} changeContext={this.changeContext}/>}/>

              {
                this.state.loggedUser ? (
                <Route path="/users/:userId"
                  render={ props => <UserDetail {...props} changeContext={this.changeContext} /> }
                />
                ) :
                <Redirect path="/users/:userId" to="/login-register" />
              }              

              {
                this.state.loggedUser ? (
                <Route path="/photos/:userId"
                  render ={ props => <UserPhotos {...props} changeContext={this.changeContext} /> }/>
                ):
                <Redirect path="/photos/:userId" to="/login-register" />
            }

              {
                this.state.loggedUser ? 
                <Route path="/users" component={UserList}  /> :
                <Redirect path="/users" to="/login-register" />
              }
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
      </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);

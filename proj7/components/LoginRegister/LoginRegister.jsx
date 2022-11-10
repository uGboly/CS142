import React from 'react';
import {
    Button,
    Input,
    FormControl,
    InputLabel,
    Grid,
    Typography
} from '@material-ui/core';
import axios from 'axios';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginName: '',
            registerName: '',
            loginPassword: '',
            registerPassword: '',
            registerPassword2: '',
            firstName: '',
            lastName: '',
            occupation: '',
            location: '',
            description: '',
            registerState: ''
        };
        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleLogin() {
        const formData = new FormData();
        formData.append('login_name', this.state.loginName);
        formData.append('password', this.state.loginPassword);

        axios.post('/admin/login', formData)
            .then(res => {
                this.props.changeContext({loggedUser: res.data.first_name});
                this.props.history.push(`/users/${res.data._id}`);
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    loginName :  '',
                    loginPassword : ''
                });
            });
    }

    handleRegister() {
        if (this.state.registerPassword !== this.state.registerPassword2) {
            this.setState({
                registerState: "Two passwords are not the same!"
            });
            return;
        }

        const formData = new FormData();
        formData.append('login_name', this.state.registerName);
        formData.append('password', this.state.registerPassword);
        formData.append('first_name', this.state.firstName);
        formData.append('last_name', this.state.lastName);
        formData.append('occupation', this.state.occupation);
        formData.append('location', this.state.location);
        formData.append('description', this.state.description);

        axios.post('/user', formData)
            .then(() => {
                this.setState({
                    registerState: "Successfully registered!"
                });
            })
            .catch(err => {
                this.setState({
                    registerName:  '',
                    registerPassword: '',
                    registerPassword2: '',
                    firstName: '',
                    lastName: '',
                    occupation: '',
                    location: '',
                    description: '',
                    registerState: 'Fail to register because ' + err.message
                });
            });
    }

    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    render() {
        let registerHint = (
            <Grid item xs={12}>
                <Typography>
                {this.state.registerState}
                </Typography>
            </Grid>
        );

        return (
            <Grid container spacing={8} direction='row' justifyContent='space-around'>
                <Grid item container sm={4} spacing={3} style={{height:'50%'}}>
                    <Grid item xs={12}>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="login-name">Login Name</InputLabel>
                            <Input id="login-name" name='loginName' value={this.state.loginName} onChange={this.handleChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="loginPassword">Password</InputLabel>
                            <Input id="loginPassword" name='loginPassword' type='password' value={this.state.loginPassword} onChange={this.handleChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" component="button" onClick={this.handleLogin}>Login</Button>
                    </Grid>
                </Grid>

                <Grid item container sm={4} spacing={2} > 
                    {this.state.registerState !== '' ? registerHint : ''}
                    
                    <Grid item xs={12}>
                        <FormControl variant="standard" sx={{width:'30%'}}>
                            <InputLabel htmlFor="register-name">Login Name</InputLabel>
                            <Input id="register-name" name='registerName' value={this.state.registerName} onChange={this.handleChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="standard" sx={{width:'30%'}}>
                            <InputLabel htmlFor="first_name">First Name</InputLabel>
                            <Input id="first_name" name='firstName' value={this.state.firstName} onChange={this.handleChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="standard" sx={{width:'30%'}}>
                            <InputLabel htmlFor="last_name">Last Name</InputLabel>
                            <Input id="last_name" name='lastName' value={this.state.lastName} onChange={this.handleChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="standard" sx={{width:'30%'}}>
                            <InputLabel htmlFor="location">Location</InputLabel>
                            <Input id="location" name='location' value={this.state.location} onChange={this.handleChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="standard" sx={{width:'30%'}}>
                            <InputLabel htmlFor="occupation">occupation</InputLabel>
                            <Input id="occupation" name='occupation' value={this.state.occupation} onChange={this.handleChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="standard" sx={{width:'30%'}}>
                            <InputLabel htmlFor="description">Description</InputLabel>
                            <Input id="description" name='description' value={this.state.description} onChange={this.handleChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="standard" sx={{width:'30%'}}>
                            <InputLabel htmlFor="registerPassword">Password</InputLabel>
                            <Input id="registerPassword" name='registerPassword' type='password' value={this.state.registerPassword} onChange={this.handleChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="standard" sx={{width:'30%'}}>
                            <InputLabel htmlFor="registerPassword2">Password Again</InputLabel>
                            <Input id="registerPassword2" name='registerPassword2' type='password' value={this.state.registerPassword2} onChange={this.handleChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" component="button" onClick={this.handleRegister}>Register Me!</Button>
                    </Grid>
                </Grid>
            </Grid>
            
        );
    }
}

export default LoginRegister;
import React from 'react';
import {
    Button,
    Box,
    Input,
    FormControl,
    InputLabel
} from '@material-ui/core';
import axios from 'axios';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginName: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const formData = new FormData();
        formData.append('loginName', this.state.loginName);

        axios.post('/admin/login', formData)
            .then(res => {
                this.props.changeContext({loggedUser: res.data.first_name});
                this.props.history.push(`/users/${res.data._id}`);
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    loginName: ''
                });
            });
    }

    handleChange(e) {
        this.setState({
            loginName: e.target.value
        });
    }

    render() {
        return (
            <Box sx={{width:'100%'}}>
                <FormControl variant="standard">
                    <InputLabel htmlFor="login-name">Login Name</InputLabel>
                    <Input id="login-name" value={this.state.loginName} onChange={this.handleChange} />
                </FormControl>
                <Button variant="contained" component="button" onClick={this.handleClick}>Login</Button>
            </Box>
        );
    }


}

export default LoginRegister;
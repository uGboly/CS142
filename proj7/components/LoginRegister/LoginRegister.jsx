import React from 'react';
import {
    Button,
    Box,
    TextField
} from '@material-ui/core';
import axios from 'axios';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginName : undefined
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        axios.post('/admin/login')
        .then(res => {
            this.props.changeContext({
                view : 'home',
                user : null,
                logedUser : res.data.first_name
            });
        })
        .catch(err => {
            console.log(err);
            this.setState({
                loginName : null
            });
        });
    }

    handleChange(e) {
        this.setState({
            loginName : e.target.value
        });
    }

    render() {
        return (
            <Box component="form" onSubmit={this.handleSubmit}>
                <TextField lable="login name" variant="outlined" value={this.state.loginName}></TextField>
                <Button variant="contained" >Login</Button>
            </Box>
        );
    }

    
}

export default LoginRegister;
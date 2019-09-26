import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LabledInput from './LabeledInput'
import Button from './Button'
import styles from "../index.css";
const axios = require('axios');


class SignUp extends Component {

    constructor(props) {
      super(props);
      this.state = {
          username: '',
          password: ''
      }
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.saveUser = this.saveUser.bind(this);
    }

    // updates username in state to what the user has typed
    setUsername(value) {
      this.setState({ username: value })
    }
  
    // updates password in state to what the user has typed
    setPassword(value) {
      this.setState({ password: value })
    }

    // adds new username and password to the database
    saveUser() { // sign up
      // post req to store username and password from state to database
      const userData = {
          username: this.state.username,
          password: this.state.password
      };
      axios.post('/signup', userData)
      .then((res) => {
          console.log(res.data);
      })
      .catch((err) => {
          console.log(err);
      })
    }

    render() {
      // render logic (custom styles?)
      return (
        <div>
            <h1 className="featured-text">Sign Up</h1>
            <LabledInput 
              label="Username" 
              value={this.state.username} 
              updateValue={this.setUsername}
            />
            <LabledInput 
              hidden
              label="Password" 
              value={this.state.password} 
              updateValue={this.setPassword}
            />
            <Button
              title="Sign up"
              onClick={this.saveUser}
              />
        </div>
    )

    };
}

export default SignUp;
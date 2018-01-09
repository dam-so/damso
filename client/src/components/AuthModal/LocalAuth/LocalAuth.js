import React, { Component } from 'react';
import axios from 'axios';

import SpanAnimatedText from 'sharedComponents/SpanAnimatedText';
import PlainBtn from 'sharedComponents/PlainBtn';
import LoadingCircle from 'sharedComponents/LoadingCircle';

import inputValidator from 'sharedUtils/inputValidator';

import './LocalAuth.scss';

class Login extends Component {

  constructor(props) {

    super(props);

    this.initialState = {
      email: '',
      password: '',
      message: [],
      isLoading: false
    };

    this.state = this.initialState;

  }

  onChangeHandler = (e) => {

    this.setState({
      [e.target.name]: inputValidator.trim(e.target.value)
    });

  };

  onSubmitHandler = (e) => {

    e.preventDefault();

    const { auth } = this.props;

    this.setState({
      isLoading: true
    });

    if (auth.type === 'login') {
      this.onLogin();
    } else if (auth.type === 'register') {
      this.onRegister();
    }

  };

  async onLogin() {

    const { onSuccess } = this.props;
    const { email, password } = this.state;

    if (inputValidator.isEmpty(email) || inputValidator.isEmpty(password)) {

      this.setState({
        isLoading: false,
        message: ['Please enter your email and password.']
      });

    } else {

      this.setState({
        message: []
      });

      const payload = { email, password };

      try {

        const { data } = await axios.post('/api/user/signin/local', payload);

        onSuccess(data);

      } catch (error) {

        this.setState({
          isLoading: false,
          message: [error.response.data]
        });

      }
    }

  }

  async onRegister() {

    const { onRegister } = this.props;
    const { email, password } = this.state;

    const messages = [];

    if (inputValidator.isEmpty(email)) {

      messages.push('Please enter your email.');

    } else if (!inputValidator.isEmail(email)) {

      messages.push('The provided email address is not valid.');

    } else {

      const { data } = await axios.get(`/api/user/validate/email/${email}`);

      if (data.isDuplicate) {
        messages.push('The email address is already registered.');
      }

    }

    if (inputValidator.isEmpty(password)) {

      messages.push('Please enter your password.');

    } else if (password.length < 6) {

      messages.push('Password must be more than 4 characters.');

    } else if (password.length > 30) {

      messages.push('Password must be less than 20 characters.');

    } else if (!inputValidator.isPassword(password)) {

      messages.push('The provided password is not valid.');

    }

    if (messages.length > 0) {

      this.setState({
        isLoading: false,
        message: messages
      });

    } else {

      this.setState({
        isLoading: false,
        message: []
      });

      onRegister({ email, password });

    }

  }

  typeToggle = () => {

    const { auth } = this.props;

    this.setState(this.initialState);

    if (auth.type === 'login') {
      this.props.redirectToRegister();
    } else {
      this.props.redirectToLogin();
    }

  };

  render() {

    const { auth } = this.props;

    const isLogin = auth.type === 'login';
    const formText = isLogin ? 'Log In' : 'Sign Up';

    return (
      <div className="local-auth">
        <SpanAnimatedText
          text={ `${formText} With Email` }
          animateAtDidMount
        />
        <form onSubmit={ this.onSubmitHandler } noValidate>
          {
            this.state.message.map((msg) => {
              return (
                <div
                  key={ msg.length }
                  className="submit-message">
                  <p>{ msg }</p>
                </div>
              );
            })
          }
          <div key={ 0 } className="input-field">
            <i className="material-icons prefix">email</i>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              disabled={ this.state.isLoading }
              onChange={ this.onChangeHandler }
              value={ this.state.email } />
          </div>
          <div key={ 1 } className="input-field">
            <i className="material-icons prefix">lock</i>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              disabled={ this.state.isLoading }
              onChange={ this.onChangeHandler }
              value={ this.state.password } />
          </div>
          <button
            type="submit"
            className="btn"
            disabled={ this.state.isLoading }>
            {
              this.state.isLoading
                ? <LoadingCircle color="#004D40" />
                : formText
            }
          </button>
        </form>
        <div className="other-options">
          <PlainBtn onClick={ this.typeToggle }>
            { `${!isLogin ? 'Log In' : 'Sign Up'} ${isLogin ? 'For Free' : 'With Email'}` }
          </PlainBtn>
          <PlainBtn>
            Forgot Your Password?
          </PlainBtn>
        </div>
      </div>

    );

  }

}

export default Login;
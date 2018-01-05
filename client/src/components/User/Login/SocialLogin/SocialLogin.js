import React, { Component } from 'react';
import axios from 'axios';

import FormMessage from 'sharedComponents/FormMessage';
import LoadingOverlay from 'sharedComponents/LoadingOverlay';

import './SocialLogin.scss';

import FacebookAuth from './Facebook';
import GoogleAuth from './Google';
import KakaoAuth from './Kakao';

class SocialLogin extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: false,
      message: ''
    };

  }

  onSuccess = async (payload) => {

    const { onRegister, onSuccess } = this.props;

    this.setState({ isLoading: true });

    try {
      const { data } = await axios.post('/api/auth/login/social', payload);
      if (data.shouldRegister) {
        onRegister(data.profile);
      } else {
        onSuccess(data.user);
      }
    } catch (error) {
      console.error(error.response.data.error);
      this.setState({
        message: error.response.data.message,
        isLoading: false,
      });
    }

  };

  render() {

    const {
      REACT_APP_facebookClientId: facebookId,
      REACT_APP_googleClientId: googleId,
      REACT_APP_kakaoClientId: kakaoId
    } = process.env;

    const { isLoading, message } = this.state;

    return (
      <div key={ 1 } className="user-form-box user-login-social">
        <LoadingOverlay
          isVisible={ isLoading }
          overlayColor="rgba(256,256,256,.75)"
          circleColor="#1F4B40" />
        <div className="user-form-header">
          <h3>Connect with</h3>
        </div>
        <div className="social-btn-wrapper">
          <FormMessage message={ message } />
          <div className="facebook">
            <FacebookAuth
              clientId={ facebookId }
              fields="name,email,picture"
              onSuccess={ this.onSuccess }>
              <img src="/social-icons/facebook.png" alt="facebook-login" />
              <span className="center-align">Facebook</span>
            </FacebookAuth>
          </div>
          <div className="google">
            <GoogleAuth
              clientId={ googleId }
              onSuccess={ this.onSuccess }>
              <img src="/social-icons/google.png" alt="google-login" />
              <span className="center-align">Google</span>
            </GoogleAuth>
          </div>
          <div className="kakao">
            <KakaoAuth
              clientId={ kakaoId }
              onSuccess={ this.onSuccess }>
              <img src="/social-icons/kakao.png" alt="kakao-login" />
              <span className="center-align">Kakao</span>
            </KakaoAuth>
          </div>
        </div>
      </div>
    );
  }

}

export default SocialLogin;
const axios = require('axios');

const socialAuthUtils = {

  facebook: (accessToken) => {
    return axios
      .get(`https://graph.facebook.com/v2.11/me?fields=id,name,email,picture&access_token=${accessToken}`)
      .then((response) => {
        return {
          strategy: 'facebook',
          email: response.data.email,
          username: response.data.name,
          avatar: response.data.picture.data.url,
          social: {
            id: response.data.id,
            accessToken,
          }
        };
      });
  },

  google: (accessToken) => {
    return axios
      .get('https://www.googleapis.com/plus/v1/people/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        return {
          strategy: 'google',
          email: response.data.emails[0].value,
          username: response.data.displayName,
          avatar: response.data.image.url,
          social: {
            id: response.data.id,
            accessToken
          }
        };
      });
  },

  kakao: (accessToken) => {
    return axios
      .get('https://kapi.kakao.com/v1/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        return {
          strategy: 'kakao',
          email: response.data.kaccount_email,
          username: response.data.properties.nickname,
          avatar: response.data.properties.profile_image,
          social: {
            id: response.data.id,
            accessToken
          }
        };
      });
  }

};

module.exports = socialAuthUtils;

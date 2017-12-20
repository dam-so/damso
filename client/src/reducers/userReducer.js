import * as types from '../actions/types';

const initialState = {
  user: {
    isLoggedIn: false,
    _id: null,
    email: null,
    username: null,
    avatar: null
  },
  userModalInfo: {
    _id: null,
    username: null,
    avatar: null
  }
};

export default function (state = initialState.user, action) {

  switch (action.type) {

    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: true,
        _id: action.payload._id,
        email: action.payload.email,
        username: action.payload.username,
        avatar: action.payload.avatar || null
      });

    case types.LOGOUT:
      return initialState.user;
    case types.OPEN_USERINFO_MODAL:
      return Object.assign({}, state, {
        userModalInfo: {
          _id: action.userInfo._id,
          username: action.userInfo.username,
          avatar: action.userInfo.avatar
        }
      });
    case types.CLOSE_USERINFO_MODAL:
      return Object.assign({}, state, {
        userModalInfo: {
          _id: null,
          username: null,
          avatar: null
        }
      });

    default:
      return state;

  }

}

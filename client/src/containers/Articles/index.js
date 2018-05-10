import { connect } from 'react-redux';
import * as actions from '@actions';
import Articles from './Articles';

const mapStateToProps = (state) => {
  return {
    postsList: state.posts.list,
    pagination: state.posts.pagination,
    user: state.user.user,
    boardAuthor: state.posts.boardAuthor,
    boardInfo: state.posts.boardInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPostsRequest: (boardId, page, sort) => {
      if (page === null || page === undefined) {
        page = 1;
      } else {
        page += 1;
      }
      return dispatch(actions.fetchPostsRequest(boardId, page, sort));
    },
    searchPostsRequest: (searchWord, boardId, page, sort) => {
      if (page === null || page === undefined) {
        page = 1;
      } else {
        page += 1;
      }
      if (searchWord === '') {
        dispatch(actions.fetchPostsRequest(boardId, page, sort));
      } else {
        dispatch(actions.searchPostsRequest(searchWord, boardId, page, sort));
      }
    },
    openUserInfoModal: (userInfo) => {
      dispatch(actions.openUserInfoModal(userInfo));
    },
    bookmarkRequest: (boardId, user) => {
      return dispatch(actions.bookmarkRequest(boardId, user));
    },
    resetPostProps: () => {
      return dispatch(actions.resetPostProps());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Articles);

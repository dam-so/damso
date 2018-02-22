import { connect } from 'react-redux';
import * as actions from '@actions';
import ArticleNew from './ArticleNew';

const mapStateToProps = (state) => {
  return {
    updateComment: state.posts.updateComment,
    user: state.user.user,
    newPost: state.posts.newPost,
    data: state.posts.activePost.data
    // data: state.posts.activePost.data
    // activePost: state.posts.activePost,
    // postId: ownProps.match.params.postId,
    // deletePost: state.posts.deletePost,
    // editPost: state.posts.editPost,
    // newComment: state.posts.newComment,
    // likes: state.posts.likes,
    // disLikes: state.posts.disLikes,
    // user: state.user,
    // replyComment: state.replyComment
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createPostRequest: (values, boardId) => {
      return dispatch(actions.createPostRequest(values, boardId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleNew);
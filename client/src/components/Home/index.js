import { connect } from 'react-redux';
import Home from './Home';
import * as actions from '../../actions';

const mapStateToProps = (state) => {
  return {
    layout: state.layout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMenu: () => dispatch(actions.toggleMenu())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
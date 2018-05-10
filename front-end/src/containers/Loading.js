import { connect } from 'react-redux';
import Loading from '../Loading';

const mapStateToProps = state => ({ isLoading: state.loading });
export default connect(mapStateToProps)(Loading);
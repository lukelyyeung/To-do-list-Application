import { connect } from 'react-redux';
import { dismissAlertAction } from '../actions/Alert';
import AlertBox from '../AlertBox';

const mapStateToProps = (state) => ({
    isAlert: state.alert.isAlert,
    message: state.alert.message,
    title: state.alert.title
});

const mapDispatchToProps = dispatch => ({
    dismissTrigger: () => dispatch(dismissAlertAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertBox);
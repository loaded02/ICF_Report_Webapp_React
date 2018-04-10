import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReportList from './ReportList';
import Disclaimer from './Disclaimer';
import agent from '../../agent';
import {
    HOME_PAGE_LOADED,
    HOME_PAGE_UNLOADED
} from "../../constants/actionTypes";
import ListErrors from '../ListErrors';

const mapStateToProps = state => ({
    reports: state.home.reports,
    currentUser: state.common.currentUser,
    errors: state.home.errors
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload => dispatch({type: HOME_PAGE_LOADED, payload}),
    onUnload: () => dispatch({ type: HOME_PAGE_UNLOADED })
});

class Home extends Component {

    componentWillMount() {
        this.props.onLoad(Promise.all([
            agent.Report.all()
        ]));
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        if (this.props.currentUser) {
            return (
                <div className="container main">
                    <h1>Your ICF Core Sets</h1>
                    <ListErrors errors={this.props.errors} />
                    <ReportList reports={this.props.reports} error={this.props.error}/>
                </div>
            );
        } else {
            return (
                <Disclaimer/>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
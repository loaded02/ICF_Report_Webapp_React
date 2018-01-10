import React, {Component} from 'react';
import {connect} from 'react-redux';
import agent from '../../agent';
import CodeList from './CodeList';
import ListErrors from '../ListErrors';
import CodeForm from './CodeForm';
import {
    CODE_PAGE_LOADED,
    CODE_PAGE_UNLOADED
} from "../../constants/actionTypes";

const mapStateToProps = state => ({
    ...state.code
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload => dispatch({type: CODE_PAGE_LOADED, payload}),
    onUnload: () => dispatch({ type: CODE_PAGE_UNLOADED })
});

class Code extends Component {

    componentWillMount() {
        this.props.onLoad(Promise.all([
            agent.Code.all()
        ]));
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        return (
            <div className="container main">
                <h1>ICF Code Form</h1>
                <ListErrors errors={this.props.errors} />
                <CodeForm/>
                <hr/>
                <h1>Existing ICF Codes</h1>
                <CodeList codes={this.props.codes} error={this.props.error} />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Code);
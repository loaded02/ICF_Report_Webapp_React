import React, {Component} from 'react';
import {connect} from 'react-redux';
import agent from '../../agent';
import CodeList from './CodeList';
import ListErrors from '../ListErrors';
import CodeForm from './CodeForm';
import {Nav, NavItem, Button, Alert} from 'reactstrap';
import {
    CODE_PAGE_LOADED,
    CODE_PAGE_UNLOADED,
    CODE_EDITOR_PAGE_TOGGLED
} from "../../constants/actionTypes";

const mapStateToProps = state => ({
    ...state.code
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload => dispatch({type: CODE_PAGE_LOADED, payload}),
    onUnload: () => dispatch({ type: CODE_PAGE_UNLOADED }),
    onToggleCodeEditor: () => dispatch({type: CODE_EDITOR_PAGE_TOGGLED})
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
                <ListErrors errors={this.props.errors} />
                <Nav className="navbar--settings">
                    <NavItem>
                        <Button color="secondary" outline onClick={this.props.onToggleCodeEditor}>Add Code</Button>
                    </NavItem>
                </Nav>
                <hr/>
                {this.props.successId ? <Alert color="success">Action successfull. Id:{this.props.successId}</Alert> : null}
                <h1>Community ICF Codes</h1>
                <CodeList codes={this.props.codes} error={this.props.error} />
                <CodeForm/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Code);
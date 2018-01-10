import React, {Component} from 'react';
import {Button, Col, Form, FormGroup, Label, Input, Alert} from 'reactstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import ListErrors from './ListErrors';
import agent from '../agent';
import {
    UPDATE_FIELD_AUTH,
    LOGIN,
    LOGIN_PAGE_UNLOADED
} from '../constants/actionTypes';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    onChangeEmail: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
    onChangePassword: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
    onSubmit: (email, password) =>
        dispatch({ type: LOGIN, payload: agent.Auth.login(email, password) }),
    onUnload: () =>
        dispatch({ type: LOGIN_PAGE_UNLOADED })
});

class Login extends Component {
    constructor() {
        super();
        this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
        this.changePassword = ev => this.props.onChangePassword(ev.target.value);
        this.submitForm = (email, password) => ev => {
            ev.preventDefault();
            this.props.onSubmit(email, password);
        };
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        const email = this.props.email;
        const password = this.props.password;
        return (
            <div className="container main">
                <Alert color="dark">
                    <Link to="/register" className="alert-link">
                        Need an account?
                    </Link>
                </Alert>

                <ListErrors errors={this.props.errors} />

                <Form onSubmit={this.submitForm(email, password)}>
                    <FormGroup row>
                        <Label for="email" sm={2}>Email</Label>
                        <Col sm={10}>
                            <Input type="email" name="email"
                                id="email" placeholder="Email"
                                value={email}
                                onChange={this.changeEmail}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="password" sm={2}>Password</Label>
                        <Col sm={10}>
                            <Input type="password" name="password"
                                id="password" placeholder="Password"
                                value={password}
                                onChange={this.changePassword}/>
                        </Col>
                    </FormGroup>
                    <FormGroup check row>
                        <Col sm={{size:10, offset:2}}>
                            <Button type="submit"
                                disabled={this.props.inProgress}>
                                Sign in</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
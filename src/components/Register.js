import React, {Component} from 'react';
import {Button, Col, Form, FormGroup, Label, Input, Alert} from 'reactstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import ListErrors from './ListErrors';
import agent from '../agent';
import {
    UPDATE_FIELD_AUTH,
    REGISTER,
    REGISTER_PAGE_UNLOADED
} from '../constants/actionTypes';
import { Redirect } from 'react-router-dom'

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    onChangeEmail: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
    onChangePassword: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
    onChangeUsername: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'username', value }),
    onChangeFirstname: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'firstname', value }),
    onChangeLastname: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'lastname', value }),
    onSubmit: (username, email, password, firstname, lastname) => {
        const payload = agent.Auth.register(username, email, password, firstname, lastname);
        dispatch({ type: REGISTER, payload })
    },
    onUnload: () =>
        dispatch({ type: REGISTER_PAGE_UNLOADED })
});

class Register extends Component {
    constructor() {
        super();
        this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
        this.changePassword = ev => this.props.onChangePassword(ev.target.value);
        this.changeUsername = ev => this.props.onChangeUsername(ev.target.value);
        this.changeFirstname = ev => this.props.onChangeFirstname(ev.target.value);
        this.changeLastname = ev => this.props.onChangeLastname(ev.target.value);
        this.submitForm = (username, email, password, firstname, lastname) => ev => {
            ev.preventDefault();
            this.props.onSubmit(username, email, password, firstname, lastname);
        }
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        if (this.props.redirectToHome) {
            return (<Redirect to="/"/>)
        }
        const email = this.props.email;
        const password = this.props.password;
        const username = this.props.username;
        const firstname = this.props.firstname;
        const lastname = this.props.lastname;
        return (
            <div className="container main">
                <Alert color="dark">
                    <Link to="login" className="alert-link">
                        Already have an account?
                    </Link>
                </Alert>

                <ListErrors errors={this.props.errors} />

                <Form onSubmit={this.submitForm(username, email, password, firstname, lastname)}>
                    <FormGroup row>
                        <Label for="firstName" sm={2}>Firstname</Label>
                        <Col sm={10}>
                            <Input type="text" name="firsName" id="firstName" placeholder="Firstname"
                                   value={this.props.firstname}
                                   onChange={this.changeFirstname}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="lastName" sm={2}>Lastname</Label>
                        <Col sm={10}>
                            <Input type="text" name="lastName" id="lastName" placeholder="Lastname"
                                   value={this.props.lastname}
                                   onChange={this.changeLastname}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="userName" sm={2}>Username *</Label>
                        <Col sm={10}>
                            <Input type="text" name="userName" id="userName" placeholder="Username"
                                   value={this.props.username} required
                                   onChange={this.changeUsername}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="email" sm={2}>Email *</Label>
                        <Col sm={10}>
                            <Input type="email" name="email" id="email" placeholder="Email"
                                   value={this.props.email} required
                                   onChange={this.changeEmail}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="password" sm={2}>Password *</Label>
                        <Col sm={10}>
                            <Input type="password" name="password" id="password" placeholder="Password"
                                   value={this.props.password} required
                                   onChange={this.changePassword}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="password" sm={2}>Retype Password</Label>
                        <Col sm={10}>
                            <Input type="password" name="re-password" id="re-password" placeholder="Password" disabled />
                        </Col>
                    </FormGroup>
                    <FormGroup check row>
                        <Col sm={{size:10, offset:2}}>
                            <Button
                                type="submit"
                                disabled={this.props.inProgress}
                            >Sign up</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
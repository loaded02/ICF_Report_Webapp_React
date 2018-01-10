import ListErrors from './ListErrors';
import React, {Component} from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {Button, Col, Form, FormGroup, Label, Input} from 'reactstrap';
import {
    SETTINGS_SAVED,
    SETTINGS_PAGE_UNLOADED,
    LOGOUT
} from '../constants/actionTypes';

class SettingsForm extends Component {
    constructor() {
        super();

        this.state = {
            username: '',
            firstname: '',
            lastname: '',
            email: ''
        };

        this.updateState = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.value });
            this.setState(newState);
        };

        this.submitForm = ev => {
            ev.preventDefault();

            const user = Object.assign({}, this.state);
            if (!user.password) {
                delete user.password;
            }

            this.props.onSubmitForm(user);
        };
    }

    componentWillMount() {
        if (this.props.currentUser) {
            Object.assign(this.state, {
                username: this.props.currentUser.username,
                firstname: this.props.currentUser.firstname || '',
                lastname: this.props.currentUser.lastname || '',
                email: this.props.currentUser.email
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentUser) {
            this.setState(Object.assign({}, this.state, {
                username: nextProps.currentUser.username,
                firstname: nextProps.currentUser.firstname || '',
                lastname: nextProps.currentUser.lastname || '',
                email: nextProps.currentUser.email
            }));
        }
    }

    render() {
        return (
            <Form onSubmit={this.submitForm} className="form--settings">
                <FormGroup row>
                    <Label for="firstName" sm={2}>Firstname</Label>
                    <Col sm={10}>
                        <Input type="text" name="firsName"
                               id="firstName" placeholder="Firstname"
                               value={this.state.firstname}
                               onChange={this.updateState('firstname')}/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="lastName" sm={2}>Lastname</Label>
                    <Col sm={10}>
                        <Input type="text" name="lastName"
                               value={this.state.lastname}
                               onChange={this.updateState('lastname')}
                               id="lastName" placeholder="Lastname"/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="userName" sm={2}>Username</Label>
                    <Col sm={10}>
                        <Input type="text" name="userName"
                               value={this.state.username}
                               onChange={this.updateState('username')}
                               id="userName" placeholder="Username"/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="email" sm={2}>Email</Label>
                    <Col sm={10}>
                        <Input type="email" name="email"
                               value={this.state.email}
                               onChange={this.updateState('email')}
                               id="email" placeholder="Email" />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="password" sm={2}>New Password</Label>
                    <Col sm={10}>
                        <Input type="password" name="password" id="password" placeholder="Password" disabled />
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
                        <Button color="primary" type="submit" disabled={this.state.inProgress}>
                            Save
                        </Button>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}

const mapStateToProps = state => ({
    ...state.settings,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
    onClickLogout: () => dispatch({ type: LOGOUT }),
    onSubmitForm: user =>
        dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(user) }),
    onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

class Settings extends Component {
    render() {
        return (
            <div className="container main">
                <h1>Your Settings</h1>

                <ListErrors errors={this.props.errors} />

                <SettingsForm
                    currentUser={this.props.currentUser}
                    onSubmitForm={this.props.onSubmitForm} />

                <hr />
                <Button color="danger" onClick={this.props.onClickLogout}>Or click here to logout.</Button>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
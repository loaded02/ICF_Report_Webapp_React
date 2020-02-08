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

const mapStateToProps = state => ({
    ...state.settings,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
    onClickLogout: () => dispatch({ type: LOGOUT }),
    onSubmitForm: user =>
        dispatch({ type: SETTINGS_SAVED, payload: user }),
    onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

class Settings extends Component {
    constructor() {
        super();

        this.state = {
            newUser: {
                firstname: '',
                lastname: '',
                username: '',
                email: '',
            }
        }

        this.updateState = ev => {
            const tempUser = this.state.newUser;
            Object.assign(tempUser, {[ev.target.name]: ev.target.value})
            this.setState({ newUser: tempUser });
        };

        this.submitForm.bind(this);
    }

    submitForm = ev => {
        ev.preventDefault();
        this.props.onSubmitForm(agent.Auth.save(this.state.newUser));
    };

    componentDidMount() {
        this.setState({ newUser: {
            firstname: this.props.currentUser.firstname || '',
            lastname: this.props.currentUser.lastname || '',
            username: this.props.currentUser.username || '',
            email: this.props.currentUser.email || ''
         }
        });
      }

    render() {
        return (
            <div className="container main">
                <h1>Your Settings</h1>

                <ListErrors errors={this.props.errors} />

                <Form onSubmit={this.submitForm} className="form--settings">
                <FormGroup row>
                    <Label for="firstName" sm={2}>Firstname</Label>
                    <Col sm={10}>
                        <Input type="text" name="firstname"
                               id="firstName" placeholder="Firstname"
                               value={this.state.newUser.firstname}
                               onChange={this.updateState}/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="lastName" sm={2}>Lastname</Label>
                    <Col sm={10}>
                        <Input type="text" name="lastname"
                               value={this.state.newUser.lastname}
                               onChange={this.updateState}
                               id="lastName" placeholder="Lastname"/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="userName" sm={2}>Username</Label>
                    <Col sm={10}>
                        <Input type="text" name="username"
                               value={this.state.newUser.username}
                               onChange={this.updateState}
                               id="userName" placeholder="Username"/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="email" sm={2}>Email</Label>
                    <Col sm={10}>
                        <Input type="email" name="email"
                               value={this.state.newUser.email}
                               onChange={this.updateState}
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
                        <Button color="primary" type="submit" disabled={this.props.inProgress}>
                            Save
                        </Button>
                    </Col>
                </FormGroup>
            </Form>

                <hr />
                <Button color="danger" onClick={this.props.onClickLogout}>Or click here to logout.</Button>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
import React, {Component} from 'react';
import {connect} from 'react-redux';
import agent from '../../agent';
import ListErrors from '../ListErrors';
import {Button, Col, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {
    CODE_FORM_PAGE_LOADED,
    CODE_FORM_PAGE_UNLOADED,
    CODE_EDITOR_PAGE_TOGGLED,
    CODE_SUBMITTED,
    CODE_ADDED,
    CODE_UPDATED
} from "../../constants/actionTypes";

const mapStateToProps = state => ({
    ...state.codeForm
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({type: CODE_FORM_PAGE_LOADED, payload}),
    onUnload: () =>
        dispatch({type: CODE_FORM_PAGE_UNLOADED}),
    onToggle: () =>
        dispatch({type: CODE_EDITOR_PAGE_TOGGLED}),
    onSubmitForm: payload =>
        dispatch({ type: CODE_SUBMITTED, payload }),
    onCodeAdded: payload =>
        dispatch({ type: CODE_ADDED, payload}),
    onCodeUpdate: payload =>
        dispatch({type: CODE_UPDATED, payload})
});

class CodeForm extends Component {
    constructor() {
        super();

        this.state = {
            newCode: {
                code: '',
                title: '',
                description: ''
            }
        }

        this.updateState = ev => {
            const tempCode = this.state.newCode;
            Object.assign(tempCode, {[ev.target.name]: ev.target.value})
            this.setState({ newCode: tempCode });
        };

        this.submitForm.bind(this);
    }

    submitForm = ev => {
        ev.preventDefault();

        const promise = this.hasCurrentCode ?
            agent.Code.update(this.state.newCode, this.props.codeId) :
            agent.Code.create(this.state.newCode);
        this.props.onSubmitForm(promise);
    };

    get hasCurrentCode() {
        return typeof this.props.codeId !== 'undefined' && this.props.codeId !== null;
    }

    componentDidUpdate(prevProps) {
        if (this.props.codeId && prevProps.codeId !== this.props.codeId) {
            // loaded with id
            return this.props.onLoad(agent.Code.get(this.props.codeId));
        }
        if (!prevProps.hasOwnProperty('codeId') && this.props.codeId === null) {
            // loaded without id
            this.setState({ newCode: {
                code: this.props.code || '',
                title: this.props.title || '',
                description: this.props.description || ''
             }
            });
        }
        if (this.props.newCode) { 
            // successful update/insert
            if (this.hasCurrentCode)
                this.props.onCodeUpdate({code: this.props.newCode});
            else
                this.props.onCodeAdded({code: this.props.newCode});
            this.cancel();
        }
        if (!prevProps.codeReceived && this.props.codeReceived) {
            // successful get
            this.setState({ newCode: {
                code: this.props.code || '',
                title: this.props.title || '',
                description: this.props.description || ''
             }
            });
        }
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    cancel() {
        this.props.onToggle();
        this.props.onUnload();
    }

    render() {
        return (
            <Modal isOpen={this.props.modal} toggle={this.cancel.bind(this)}>
                <Form onSubmit={this.submitForm}>
                    <ModalHeader>{this.hasCurrentCode ? 'Update Code' : 'Add new Code'}</ModalHeader>
                    <ModalBody>
                        <ListErrors errors={this.props.errors} />
                        <FormGroup row>
                            <Label for="code" sm={2}>Code</Label>
                            <Col sm={10}>
                                <Input type="text" name="code" id="code" placeholder="Code"
                                       value={this.state.newCode.code}
                                       onChange={this.updateState}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="title" sm={2}>Title</Label>
                            <Col sm={10}>
                                <Input type="text" name="title" id="title" placeholder="Title"
                                       value={this.state.newCode.title}
                                       onChange={this.updateState}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="description" sm={2}>Description</Label>
                            <Col sm={10}>
                                <Input type="textarea" name="description" id="description" placeholder="Description"
                                       value={this.state.newCode.description}
                                       onChange={this.updateState}/>
                            </Col>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit"
                                disabled={this.props.inProgress}>
                            {this.hasCurrentCode ? 'Save' : 'Add'}</Button>{' '}
                        <Button color="secondary" onClick={this.cancel.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeForm);
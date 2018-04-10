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
    CODE_UPDATED,
    UPDATE_FIELD_CODE
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
        dispatch({type: CODE_UPDATED, payload}),
    onUpdateField: (key, value) =>
        dispatch({ type: UPDATE_FIELD_CODE, key, value }),
});

class CodeForm extends Component {
    constructor() {
        super();

        const updateFieldEvent =
            key => ev => this.props.onUpdateField(key, ev.target.value);
        this.changeCode = updateFieldEvent('code');
        this.changeTitle = updateFieldEvent('title');
        this.changeDescription = updateFieldEvent('description');

        this.submitForm = ev => {
            ev.preventDefault();

            const code = {
                code: this.props.code,
                title: this.props.title,
                description: this.props.description
            };

            const promise = this.hasCurrentCode ?
                agent.Code.update(code, this.props.codeId) :
                agent.Code.create(code);
            this.props.onSubmitForm(promise);
        };
    }

    get hasCurrentCode() {
        return typeof this.props.codeId !== 'undefined' && this.props.codeId !== null;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.codeId !== nextProps.codeId) {
            if (nextProps.codeId) { // loaded with id
                return this.props.onLoad(agent.Code.get(nextProps.codeId));
            }
            this.props.onLoad(null);
        }
        if (nextProps.newCode) { // successful update/insert
            if (this.hasCurrentCode)
                this.props.onCodeUpdate({code: nextProps.newCode});
            else
                this.props.onCodeAdded({code: nextProps.newCode});
            this.cancel();
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
                                       value={this.props.code}
                                       onChange={this.changeCode}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="title" sm={2}>Title</Label>
                            <Col sm={10}>
                                <Input type="text" name="title" id="title" placeholder="Title"
                                       value={this.props.title}
                                       onChange={this.changeTitle}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="description" sm={2}>Description</Label>
                            <Col sm={10}>
                                <Input type="textarea" name="description" id="description" placeholder="Description"
                                       value={this.props.description}
                                       onChange={this.changeDescription}/>
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
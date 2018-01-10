import React, {Component} from 'react';
import {connect} from 'react-redux';
import agent from '../../agent';
import {Button, Col, Form, FormGroup, Label, Input} from 'reactstrap';
import {
    CODE_SUBMITTED,
    CODE_ADDED,
    CODE_UPDATED,
    CODE_CLEARED,
    UPDATE_FIELD_CODE
} from "../../constants/actionTypes";

const mapStateToProps = state => ({
    ...state.code
});

const mapDispatchToProps = dispatch => ({
    onSubmitForm: payload =>
        dispatch({ type: CODE_SUBMITTED, payload: payload }),
    onCodeAdded: payload =>
        dispatch({ type: CODE_ADDED, payload}),
    onCodeUpdate: payload =>
        dispatch({type: CODE_UPDATED, payload}),
    onClearForm: () => dispatch({type: CODE_CLEARED, payload: null}),
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.newCode) { // successful update/insert
            if (this.hasCurrentCode)
                this.props.onCodeUpdate({code: nextProps.newCode});
            else
                this.props.onCodeAdded({code: nextProps.newCode});
            this.clear();
        }
    }

    get hasCurrentCode() {
        return this.props.codeId !== null;
    }

    clear() {
        Array.from(document.querySelectorAll('div[data-type="code-element"]'))
            .forEach(item => item.classList.remove('active'));
        this.props.onClearForm();
    }

    render() {
        return (
            <Form onSubmit={this.submitForm} className="form--code">
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
                <FormGroup check row>
                    <Col sm={{size:10, offset:2}}>
                        <Button color="primary" type="submit" disabled={this.props.inProgress}>Save</Button>{' '}
                        <Button color="secondary" type="button" onClick={this.clear.bind(this)}>Clear</Button>
                    </Col>
                </FormGroup>
            </Form>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeForm);
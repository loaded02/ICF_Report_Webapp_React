import React, {Component} from 'react';
import {connect} from 'react-redux';
import agent from '../../agent';
import ListErrors from '../ListErrors';
import {Button, Col, Form, FormGroup, Label, Input,
    Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {
    THERAPIST_EDITOR_PAGE_LOADED,
    THERAPIST_SUBMITTED,
    THERAPIST_EDITOR_PAGE_UNLOADED,
    UPDATE_FIELD_THERAPIST_EDITOR,
    THERAPIST_EDITOR_PAGE_TOGGLED,
    THERAPIST_ADDED,
    THERAPIST_UPDATED
} from "../../constants/actionTypes";

const mapStateToProps = state => (
    {
        ...state.therapistEditor
    });

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({ type: THERAPIST_EDITOR_PAGE_LOADED, payload }),
    onSubmit: payload =>
        dispatch({ type: THERAPIST_SUBMITTED, payload }),
    onUnload: payload =>
        dispatch({ type: THERAPIST_EDITOR_PAGE_UNLOADED }),
    onUpdateField: (key, value) =>
        dispatch({ type: UPDATE_FIELD_THERAPIST_EDITOR, key, value }),
    onToggle: () =>
        dispatch({ type: THERAPIST_EDITOR_PAGE_TOGGLED }),
    onTherapistAdded: payload =>
        dispatch({ type: THERAPIST_ADDED, payload}),
    onTherapistUpdate: payload =>
        dispatch({type: THERAPIST_UPDATED, payload})
});

class TherapistEditor extends Component {
    constructor() {
        super();

        const updateFieldEvent =
            key => ev => this.props.onUpdateField(key, ev.target.value);
        this.changeName = updateFieldEvent('name');
        this.changeSurname = updateFieldEvent('surname');
        this.changeCompany = updateFieldEvent('company');

        this.submitForm = ev => {
            ev.preventDefault();
            const therapist = {
                name: this.props.name,
                surname: this.props.surname,
                company: this.props.company,
            };

            const promise = this.hasTherapist ?
                agent.Therapist.update(therapist, this.props.therapistId) :
                agent.Therapist.create(therapist);
            this.props.onSubmit(promise);
        };
    }

    get hasTherapist() {
        return typeof this.props.therapistId !== 'undefined' && this.props.therapistId !== null;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.therapistId !== nextProps.therapistId) {
            if (nextProps.therapistId) { // loaded with id
                return this.props.onLoad(agent.Therapist.get(nextProps.therapistId));
            }
            this.props.onLoad(null);
        }
        if (nextProps.newTherapist) { // successful update/insert
            if (this.hasTherapist)
                this.props.onTherapistUpdate({therapist: nextProps.newTherapist});
            else
                this.props.onTherapistAdded({therapist: nextProps.newTherapist});
            this.cancel();
        }
    }

    componentWillMount() {
        if (this.hasTherapist) {
            return this.props.onLoad(agent.Therapist.get(this.props.therapistId));
        }
        this.props.onLoad(null);
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
                    <ModalHeader>{this.hasTherapist ? 'Update Therapist' : 'Add new Therapist'}</ModalHeader>
                    <ModalBody>
                        <ListErrors errors={this.props.errors} />
                        <FormGroup row>
                            <Label for="firstName" sm={2}>Name</Label>
                            <Col sm={10}>
                                <Input type="text" name="name" id="name" placeholder="Name"
                                       value={this.props.name}
                                       onChange={this.changeName}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="surname" sm={2}>Surname</Label>
                            <Col sm={10}>
                                <Input type="text" name="surname" id="surname" placeholder="Surname"
                                       value={this.props.surname}
                                       onChange={this.changeSurname}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="company" sm={2}>Company</Label>
                            <Col sm={10}>
                                <Input type="text" name="company" id="company" placeholder="Company"
                                       value={this.props.company}
                                       onChange={this.changeCompany}/>
                            </Col>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit"
                                disabled={this.props.inProgress}>
                            {this.hasTherapist ? 'Save' : 'Add'}</Button>{' '}
                        <Button color="secondary" onClick={this.cancel.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TherapistEditor);
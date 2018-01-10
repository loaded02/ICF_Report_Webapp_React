import React, {Component} from 'react';
import {connect} from 'react-redux';
import agent from '../../agent';
import ListErrors from '../ListErrors';
import {Button, Col, Form, FormGroup, Label, Input,
    Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import {DateTimePicker} from 'react-widgets';
import {
    PATIENT_EDITOR_PAGE_LOADED,
    PATIENT_SUBMITTED,
    PATIENT_EDITOR_PAGE_UNLOADED,
    UPDATE_FIELD_PATIENT_EDITOR,
    PATIENT_EDITOR_PAGE_TOGGLED,
    PATIENT_ADDED,
    PATIENT_UPDATED
} from "../../constants/actionTypes";

const mapStateToProps = state => (
    {
    ...state.patientEditor
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({ type: PATIENT_EDITOR_PAGE_LOADED, payload }),
    onSubmit: payload =>
        dispatch({ type: PATIENT_SUBMITTED, payload }),
    onUnload: payload =>
        dispatch({ type: PATIENT_EDITOR_PAGE_UNLOADED }),
    onUpdateField: (key, value) =>
        dispatch({ type: UPDATE_FIELD_PATIENT_EDITOR, key, value }),
    onToggle: () =>
        dispatch({ type: PATIENT_EDITOR_PAGE_TOGGLED }),
    onPatientAdded: payload =>
        dispatch({ type: PATIENT_ADDED, payload}),
    onPatientUpdate: payload =>
        dispatch({type: PATIENT_UPDATED, payload})
});

Moment.locale('de');
momentLocalizer();

class PatientEditor extends Component {
    constructor() {
        super();

        const updateFieldEvent =
            key => ev => this.props.onUpdateField(key, ev.target.value);
        this.changeName = updateFieldEvent('name');
        this.changeSurname = updateFieldEvent('surname');
        this.changeDiagnosis = updateFieldEvent('diagnosis');
        this.changeDob = ev => {
            this.props.onUpdateField('dob', ev);
        };

        this.submitForm = ev => {
            ev.preventDefault();
            const patient = {
                name: this.props.name,
                surname: this.props.surname,
                diagnosis: this.props.diagnosis,
                dob: this.props.dob && Moment(this.props.dob).isValid() ? Moment(this.props.dob).format('YYYY-MM-DD') : null
            };

            const promise = this.hasPatient ?
                agent.Patient.update(patient, this.props.patientId) :
                agent.Patient.create(patient);
            this.props.onSubmit(promise);
        };
    }

    get hasPatient() {
        return typeof this.props.patientId !== 'undefined' && this.props.patientId !== null;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.patientId !== nextProps.patientId) {
            if (nextProps.patientId) { // loaded with id
                return this.props.onLoad(agent.Patient.get(nextProps.patientId));
            }
            this.props.onLoad(null);
        }
        if (nextProps.newPatient) { // successful update/insert
            if (this.hasPatient)
                this.props.onPatientUpdate({patient: nextProps.newPatient});
            else
                this.props.onPatientAdded({patient: nextProps.newPatient});
            this.cancel();
        }
    }

    componentWillMount() {
        if (this.hasPatient) {
            return this.props.onLoad(agent.Patient.get(this.props.patientId));
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
                    <ModalHeader>{this.hasPatient ? 'Update Patient' : 'Add new Patient'}</ModalHeader>
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
                            <Label for="diagnosis" sm={2}>Diagnosis</Label>
                            <Col sm={10}>
                                <Input type="text" name="diagnosis" id="diagnosis" placeholder="Diagnosis"
                                       value={this.props.diagnosis}
                                       onChange={this.changeDiagnosis}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="dob" sm={2}>Date of birth</Label>
                            <Col sm={10}>
                                <DateTimePicker
                                    name="dob" id="dob"
                                    format='DD.MM.YYYY'
                                    time={false}
                                    value={this.props.dob}
                                    onChange={this.changeDob}
                                    placeholder="dd.mm.yyyy"
                                />
                            </Col>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit"
                                disabled={this.props.inProgress}>
                            {this.hasPatient ? 'Save' : 'Add'}</Button>{' '}
                        <Button color="secondary" onClick={this.cancel.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientEditor);
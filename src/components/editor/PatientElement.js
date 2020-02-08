import React, {Component} from 'react';
import {Col, FormGroup, Label, Input, Card, CardBody, CardHeader} from 'reactstrap';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import {DateTimePicker} from 'react-widgets';
import {connect} from 'react-redux';
import {
    UPDATE_FIELD_REPORT_PATIENT
} from "../../constants/actionTypes";
import newId from '../../utils/newId';

Moment.locale('de');
momentLocalizer();

const mapStateToProps = state => ({
    ...state.editor.patient
});

const mapDispatchToProps = dispatch => ({
    onUpdateField: (key, value) =>
        dispatch({ type: UPDATE_FIELD_REPORT_PATIENT, key, value })
});

class PatientElement extends Component {
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
    }

    componentDidMount() {
        this.nameId = newId('name');
        this.surnameId = newId('surname');
    }

    render() {
        return (
            <Card>
                <CardHeader>Patient</CardHeader>
                <CardBody>
                    <FormGroup row>
                        <Label for="firstName" sm={2}>Name</Label>
                        <Col sm={10}>
                            <Input type="text" name="name" id={this.nameId} placeholder="Name"
                                   value={this.props.name}
                                   onChange={this.changeName}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="surname" sm={2}>Surname</Label>
                        <Col sm={10}>
                            <Input type="text" name="surname" id={this.surnameId} placeholder="Surname"
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
                </CardBody>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientElement);
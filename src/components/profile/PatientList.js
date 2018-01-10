import React from 'react';
import { ListGroup } from 'reactstrap';
import PatientDeleteButton from './PatientDeleteButton';
import { connect } from 'react-redux';
import Moment from 'moment';
import {PATIENT_EDITOR_PAGE_TOGGLED} from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
    onClick: (patientId) =>
        dispatch({ type: PATIENT_EDITOR_PAGE_TOGGLED, patientId })
});

const PatientList = props => {
    console.log('patientlist', props);
    if(props.error) {
        console.log(props.error);
        return (
            <div>Error {props.error}</div>
        )
    }
    if (!props.patients) {
        return (
            <div className="patient-preview">Loading...</div>
        );
    }

    if (props.patients.length === 0) {
        return (
            <div className="patient-preview">
                No patients are here... yet.
            </div>
        );
    }

    return (
        <div>
            <ListGroup>
            {
                props.patients.map(patient => {
                    return (
                        <div className="list-group-item list-group-item-action flex-column align-items-start"
                             key={patient.id} onClick={() => props.onClick(patient.id)}>
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{patient.surname}, {patient.name}</h5>
                            </div>
                            <div className="d-flex w-100 justify-content-between">
                                <p className="mb-1">{patient.diagnosis} - {Moment(patient.dob).isValid() ? Moment(patient.dob).format('DD.MM.YYYY') : ''}</p>
                                <PatientDeleteButton patientId={patient.id}/>
                            </div>
                        </div>
                    );
                })
            }
            </ListGroup>
        </div>
    );
};

export default connect(() => ({}), mapDispatchToProps)(PatientList);
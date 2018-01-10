import React from 'react';
import agent from '../../agent';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { DELETE_PATIENT } from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
    onClick: (payload, patientId) =>
        dispatch({ type: DELETE_PATIENT, payload, patientId })
});

const PatientDeleteButton = props => {
    const del = ev => {
        ev.stopPropagation();
        ev.nativeEvent.stopImmediatePropagation();
        const payload = agent.Patient.remove(props.patientId);
        props.onClick(payload, props.patientId);
    };

    return (
        <Button type="button" outline color="danger"
                onClick={(ev) => del(ev)}>Remove</Button>
    );
};

export default connect(() => ({}), mapDispatchToProps)(PatientDeleteButton);
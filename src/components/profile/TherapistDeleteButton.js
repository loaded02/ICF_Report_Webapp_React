import React from 'react';
import agent from '../../agent';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { DELETE_THERAPIST } from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
    onClick: (payload, therapistId) =>
        dispatch({ type: DELETE_THERAPIST, payload, therapistId })
});

const TherapistDeleteButton = props => {
    const del = ev => {
        ev.stopPropagation();
        ev.nativeEvent.stopImmediatePropagation();
        const payload = agent.Therapist.remove(props.therapistId);
        props.onClick(payload, props.therapistId);
    };

    return (
        <Button type="button" outline color="danger"
                onClick={(ev) => del(ev)}>Remove</Button>
    );
};

export default connect(() => ({}), mapDispatchToProps)(TherapistDeleteButton);
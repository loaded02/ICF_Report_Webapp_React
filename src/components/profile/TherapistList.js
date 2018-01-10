import React from 'react';
import { ListGroup } from 'reactstrap';
import TherapistDeleteButton from './TherapistDeleteButton';
import { connect } from 'react-redux';
import {THERAPIST_EDITOR_PAGE_TOGGLED} from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
    onClick: (therapistId) =>
        dispatch({ type: THERAPIST_EDITOR_PAGE_TOGGLED, therapistId })
});

const TherapistList = props => {
    console.log('therapistlist', props)
    if(props.error) {
        console.log(props.error)
        return (
            <div>Error {props.error}</div>
        )
    }
    if (!props.therapists) {
        return (
            <div className="therapist-preview">Loading...</div>
        );
    }

    if (props.therapists.length === 0) {
        return (
            <div className="therapist-preview">
                No therapists are here... yet.
            </div>
        );
    }

    return (
        <div>
            <ListGroup>
                {
                    props.therapists.map(therapist => {
                        return (
                            <div className="list-group-item list-group-item-action flex-column align-items-start"
                                 key={therapist.id} onClick={() => props.onClick(therapist.id)}>
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">{therapist.surname}, {therapist.name}</h5>
                                </div>
                                <div className="d-flex w-100 justify-content-between">
                                    <p className="mb-1">{therapist.company}</p>
                                    <TherapistDeleteButton therapistId={therapist.id}/>
                                </div>
                            </div>
                        );
                    })
                }
            </ListGroup>
        </div>
    );
};

export default connect(() => ({}), mapDispatchToProps)(TherapistList);
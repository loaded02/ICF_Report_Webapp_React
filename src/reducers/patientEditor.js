import Moment from 'moment';
import {
    PATIENT_EDITOR_PAGE_LOADED,
    PATIENT_EDITOR_PAGE_UNLOADED,
    PATIENT_SUBMITTED,
    ASYNC_START,
    UPDATE_FIELD_PATIENT_EDITOR,
    PATIENT_EDITOR_PAGE_TOGGLED
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case PATIENT_SUBMITTED:
            return {
                ...state,
                inProgress: null,
                newPatient: !action.error ? action.payload.patient : null,
                errors: action.error ? action.payload.errors : null
            };
        case ASYNC_START:
            if (action.subtype === PATIENT_SUBMITTED) {
                return { ...state, inProgress: true };
            }
            break;
        case PATIENT_EDITOR_PAGE_LOADED:
            return {
                ...state,
                name: action.payload  ? action.payload.patient.name : '',
                surname: action.payload  ? action.payload.patient.surname : '',
                diagnosis: action.payload  ? action.payload.patient.diagnosis : '',
                dob: action.payload && Moment(action.payload.patient.dob, 'YYYY-MM-DD').isValid()  ? Moment(action.payload.patient.dob, 'YYYY-MM-DD').toDate() : null
            };
        case PATIENT_EDITOR_PAGE_TOGGLED:
            return {
                ...state,
                modal: state.modal ? !state.modal : true,
                patientId: action.patientId ? action.patientId : null
            };
        case PATIENT_EDITOR_PAGE_UNLOADED:
            return {};
        case UPDATE_FIELD_PATIENT_EDITOR:
            return { ...state, [action.key]: action.value };
        default:
            return state;
    }

    return state;
};
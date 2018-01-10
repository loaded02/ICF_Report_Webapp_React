import {
    PROFILE_PAGE_LOADED,
    PROFILE_PAGE_UNLOADED,
    PATIENT_ADDED,
    PATIENT_UPDATED,
    DELETE_PATIENT,
    THERAPIST_ADDED,
    THERAPIST_UPDATED,
    DELETE_THERAPIST
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case PROFILE_PAGE_LOADED:
            return {
                profile: action.payload[0].profile
            };
        case PATIENT_ADDED:
        case PATIENT_UPDATED:
            return {
                successId: action.payload.patient.id
            };
        case THERAPIST_ADDED:
        case THERAPIST_UPDATED:
            return {
                successId: action.payload.therapist.id
            };
        case DELETE_PATIENT:
            return {
                successId: action.patientId
            };
        case DELETE_THERAPIST:
            return {
                successId: action.therapistId
            };
        case PROFILE_PAGE_UNLOADED:
            return {};
        default:
            return state;
    }
};
import {
    PROFILE_PAGE_LOADED,
    PROFILE_PAGE_UNLOADED,
    DELETE_PATIENT,
    PATIENT_ADDED,
    PATIENT_UPDATED
} from "../constants/actionTypes";

export default (state = {}, action) => {
    switch (action.type) {
        case PROFILE_PAGE_LOADED:
            return {
                ...state,
                patients: action.payload[1]
            };
        case PATIENT_ADDED:
            return {
                ...state,
                patients: (state.patients || []).concat([action.payload.patient])
            };
        case PATIENT_UPDATED:
            return {
                ...state,
                patients: state.patients.map(pat => {
                    if(pat.id === action.payload.patient.id) {
                        return Object.assign(pat, action.payload.patient);
                    }
                    return pat;
                })
            };
        case DELETE_PATIENT:
            return {
                ...state,
                patients: state.patients.filter(pat => pat.id !== action.patientId),
                errors: action.error ? action.payload.errors : null
            };
        case PROFILE_PAGE_UNLOADED:
            return {};
        default:
            return state;
    }
}
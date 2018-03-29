import {
    PROFILE_PAGE_LOADED,
    PROFILE_PAGE_UNLOADED,
    DELETE_THERAPIST,
    THERAPIST_ADDED,
    THERAPIST_UPDATED
} from "../constants/actionTypes";

export default (state = {}, action) => {
    switch (action.type) {
        case PROFILE_PAGE_LOADED:
            return {
                ...state,
                therapists: action.payload[2]
            };
    case THERAPIST_ADDED:
            return {
                ...state,
                therapists: (state.therapists || []).concat([action.payload.therapist])
            };
        case THERAPIST_UPDATED:
            return {
                ...state,
                therapists: state.therapists.map(pat => {
                    if(pat.id === action.payload.therapist.id) {
                        return Object.assign(pat, action.payload.therapist);
                    }
                    return pat;
                })
            };
        case DELETE_THERAPIST:
            return {
                ...state,
                therapists: state.therapists.filter(pat => pat.id !== action.therapistId),
                errors: action.error ? action.payload.errors : null
            };
        case PROFILE_PAGE_UNLOADED:
            return {};
        default:
            return state;
    }
}
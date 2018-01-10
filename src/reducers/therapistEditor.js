import {
    THERAPIST_EDITOR_PAGE_LOADED,
    THERAPIST_EDITOR_PAGE_UNLOADED,
    THERAPIST_SUBMITTED,
    ASYNC_START,
    UPDATE_FIELD_THERAPIST_EDITOR,
    THERAPIST_EDITOR_PAGE_TOGGLED
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case THERAPIST_SUBMITTED:
            return {
                ...state,
                inProgress: null,
                newTherapist: !action.error ? action.payload.therapist : null,
                errors: action.error ? action.payload.errors : null
            };
        case ASYNC_START:
            if (action.subtype === THERAPIST_SUBMITTED) {
                return { ...state, inProgress: true };
            }
            break;
        case THERAPIST_EDITOR_PAGE_LOADED:
            return {
                ...state,
                name: action.payload  ? action.payload.therapist.name : '',
                surname: action.payload  ? action.payload.therapist.surname : '',
                company: action.payload  ? action.payload.therapist.company : ''
            };
        case THERAPIST_EDITOR_PAGE_TOGGLED:
            return {
                ...state,
                modal: state.modal ? !state.modal : true,
                therapistId: action.therapistId ? action.therapistId : null
            };
        case THERAPIST_EDITOR_PAGE_UNLOADED:
            return {};
        case UPDATE_FIELD_THERAPIST_EDITOR:
            return { ...state, [action.key]: action.value };
        default:
            return state;
    }

    return state;
};
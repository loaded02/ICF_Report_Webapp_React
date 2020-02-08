import {
    CODE_FORM_PAGE_LOADED,
    CODE_FORM_PAGE_UNLOADED,
    CODE_SUBMITTED,
    ASYNC_START,
    CODE_EDITOR_PAGE_TOGGLED
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case CODE_SUBMITTED:
            return {
                ...state,
                inProgress: null,
                newCode: !action.error ? action.payload.code : null,
                errors: action.error ? action.payload.errors : null
            };
        case ASYNC_START:
            if (action.subtype === CODE_SUBMITTED) {
                return { ...state, inProgress: true };
            }
            break;
        case CODE_FORM_PAGE_LOADED:
            return {
                ...state,
                codeReceived: true,
                code: action.payload  ? action.payload.code.code : '',
                title: action.payload  ? action.payload.code.title : '',
                description: action.payload  ? action.payload.code.description : '',
                inclusions: [],
                exclusions: []
            };
        case CODE_EDITOR_PAGE_TOGGLED:
            return {
                ...state,
                modal: state.modal ? !state.modal : true,
                codeId: action.codeId ? action.codeId : null
            };
        case CODE_FORM_PAGE_UNLOADED:
            return {};
        default:
            return state;
    }

    return state;
};
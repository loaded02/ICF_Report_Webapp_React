import {
    CODE_PAGE_LOADED,
    CODE_PAGE_UNLOADED,
    DELETE_CODE,
    CODE_ADDED,
    CODE_UPDATED,
    ASYNC_START,
    CODE_SUBMITTED,
    CODE_SELECTED,
    CODE_CLEARED,
    UPDATE_FIELD_CODE
} from "../constants/actionTypes";

export default (state = {}, action) => {
    switch (action.type) {
        case CODE_PAGE_LOADED:
            return {
                ...state,
                codeId: null,
                codes: action.payload[0],
                code: '',
                title: '',
                description: '',
                inclusions: [],
                exclusions: []
            };
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
        case CODE_ADDED:
            return {
                ...state,
                newCode: null,
                codes: (state.codes || []).concat([action.payload.code])
            };
        case CODE_UPDATED:
            return {
                ...state,
                newCode: null,
                codes: state.codes.map(c => {
                    if(c.id === action.payload.code.id) {
                        return Object.assign(c, action.payload.code);
                    }
                    return c;
                })
            };
        case DELETE_CODE:
            return {
                ...state,
                codes: state.codes.filter(c => c.id !== action.codeId),
                errors: action.error ? action.payload.errors : null
            };
        case CODE_SELECTED:
            return {
                ...state,
                codeId: action.payload.id,
                code: action.payload.code,
                title: action.payload.title,
                description: action.payload.description,
                inclusions: action.payload.inclusions,
                exclusions: action.payload.exclusions
            };
        case CODE_CLEARED:
            return {
                ...state,
                codeId: null,
                code: '',
                title: '',
                description: '',
                inclusions: [],
                exclusions: []
            };
        case CODE_PAGE_UNLOADED:
            return {};
        case UPDATE_FIELD_CODE:
            return {
                ...state,
                [action.key]: action.value
            };
        default:
            return state;
    }

    return state;
}
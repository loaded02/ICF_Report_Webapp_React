import {
    CODE_PAGE_LOADED,
    CODE_PAGE_UNLOADED,
    DELETE_CODE,
    CODE_ADDED,
    CODE_UPDATED
} from "../constants/actionTypes";

export default (state = {}, action) => {
    switch (action.type) {
        case CODE_PAGE_LOADED:
            return {
                ...state,
                codes: action.payload[0]
            };
        case CODE_ADDED:
            return {
                ...state,
                codes: (state.codes || []).concat([action.payload.code]),
                successId: action.payload.code.id
            };
        case CODE_UPDATED:
            return {
                ...state,
                codes: state.codes.map(c => {
                    if(c.id === action.payload.code.id) {
                        return Object.assign(c, action.payload.code);
                    }
                    return c;
                }),
                successId: action.payload.code.id
            };
        case DELETE_CODE:
            return {
                ...state,
                codes: state.codes.filter(c => c.id !== action.codeId),
                errors: action.error ? action.payload.errors : null,
                successId: action.codeId
            };
        case CODE_PAGE_UNLOADED:
            return {};
        default:
            return state;
    }
}
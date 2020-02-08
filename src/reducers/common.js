import {
    APP_LOAD,
    LOGOUT,
    SETTINGS_SAVED,
    LOGIN,
    REGISTER,
    EDITOR_PAGE_UNLOADED,
    HOME_PAGE_UNLOADED,
    SETTINGS_PAGE_UNLOADED,
    LOGIN_PAGE_UNLOADED,
    REGISTER_PAGE_UNLOADED
} from '../constants/actionTypes';

const defaultState = {
    appName: 'icf-report',
    token: null,
    viewChangeCounter: 0
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case APP_LOAD:
            return {
                ...state,
                token: action.token || null,
                appLoaded: true,
                currentUser: action.payload ? action.payload.user : null
            };
        case LOGOUT:
            return { ...state, token: null, currentUser: null };
        case SETTINGS_SAVED:
            return {
                ...state,
                currentUser: action.error ? null : action.payload.user
            };
        case LOGIN:
        case REGISTER:
            return {
                ...state,
                token: action.error ? null : action.payload.user.token,
                currentUser: action.error ? null : action.payload.user
            };
        case EDITOR_PAGE_UNLOADED:
        case HOME_PAGE_UNLOADED:
        case SETTINGS_PAGE_UNLOADED:
        case LOGIN_PAGE_UNLOADED:
        case REGISTER_PAGE_UNLOADED:
            return { ...state, viewChangeCounter: state.viewChangeCounter + 1 };
        default:
            return state;
    }
};
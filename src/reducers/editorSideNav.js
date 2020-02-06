import {
    EDITOR_SIDENAV_LOADED,
    EDITOR_SIDENAV_UNLOADED
} from "../constants/actionTypes";

export default (state = {}, action) => {
    switch (action.type) {
        case EDITOR_SIDENAV_LOADED:
            return {
                ...state
            };
        case EDITOR_SIDENAV_UNLOADED:
            return {};
        default:
            return state;
    }
}
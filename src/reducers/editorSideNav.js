import {
    REPORT_PDF_CREATED,
    REPORT_DOWNLOADED,
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
        case REPORT_PDF_CREATED:
            return {
                blob: action.error ? null : action.payload,
                errors: action.error ? {"pdf creation":["an error occured"]} : null
            };
        case REPORT_DOWNLOADED:
            return {
                download: action.payload
            };
        default:
            return state;
    }
}
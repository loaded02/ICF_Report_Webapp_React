import {
    HOME_PAGE_LOADED,
    HOME_PAGE_UNLOADED,
    DELETE_REPORT,
    REPORT_PDF_CREATED
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_PAGE_LOADED:
            return {
                ...state,
                reports: action.payload[0]
            };
        case HOME_PAGE_UNLOADED:
            return {};
		case DELETE_REPORT:
			return {
				...state,
				reports: state.reports.filter(r => r.id !== action.reportId)
			};
        case REPORT_PDF_CREATED:
            return {
                ...state,
                blob: action.error ? null : action.payload,
                errors: action.error ? {"pdf creation":["an error occured"]} : null
            };
        default:
            return state;
    }
};
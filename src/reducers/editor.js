import Moment from 'moment';
import {
    EDITOR_PAGE_LOADED,
    EDITOR_PAGE_UNLOADED,
    REPORT_SUBMITTED,
    ASYNC_START,
    UPDATE_FIELD_REPORT,
	FUNCTION_ADDED,
	STRUCTURE_ADDED,
	ACTIVITY_ADDED,
	CONTEXT_ADDED,
    DELETE_FUNCTION,
    DELETE_STRUCTURE,
    DELETE_ACTIVITY,
    DELETE_CONTEXT,
    UPDATE_FIELD_FUNCTION,
    UPDATE_FIELD_STRUCTURE,
    UPDATE_FIELD_ACTIVITY,
    UPDATE_FIELD_CONTEXT,
    UPDATE_FIELD_FUNCTION_VALUE,
    UPDATE_FIELD_STRUCTURE_VALUE,
    UPDATE_FIELD_ACTIVITY_VALUE,
    UPDATE_FIELD_CONTEXT_VALUE
} from "../constants/actionTypes";

export default (state = {}, action) => {
    switch (action.type) {
        case EDITOR_PAGE_LOADED:
            return {
                ...state,
                patients: action.payload[0],
                therapists: action.payload[1],
                codes: action.payload[2],
				reportId: action.payload[3] ? action.payload[3].report.id : '',
                type: action.payload[3] ? action.payload[3].report.type : '',
				patientId: action.payload[3] ? action.payload[3].report.patient.id : '',
				therapistId: action.payload[3] ? action.payload[3].report.therapist.id : '',
				freeText: action.payload[3] ? action.payload[3].report.freeText : '',
				date: action.payload[3] && Moment(action.payload[3].report.date, 'YYYY-MM-DD').isValid()  ? Moment(action.payload[3].report.date, 'YYYY-MM-DD').toDate() : null,
				functions: action.payload[4] ? action.payload[4].map(f => {return {...f, codeId: f.code.id}}) : [],
				structures: action.payload[5] ? action.payload[5].map(s => {return {...s, codeId: s.code.id}}) : [],
				activities: action.payload[6] ? action.payload[6].map(a => {return {...a, codeId: a.code.id}}) : [],
				contexts: action.payload[7] ? action.payload[7].map(c => {return {...c, codeId: c.code.id}}) : []
            };
        case EDITOR_PAGE_UNLOADED:
            return {};
		case REPORT_SUBMITTED:
			return {
				...state,
				inProgress: null,
				errors: action.error ? action.payload.errors : null,
				newReport: !action.error ? action.payload.report : null,
			};
        case ASYNC_START:
			if (action.subtype === REPORT_SUBMITTED) {
				return {
					...state,
					inProgress: true
				};
			}
			break;
		case UPDATE_FIELD_REPORT:
			return {
			    ...state,
                [action.key]: action.value
			};
		case FUNCTION_ADDED:
			return {
				...state,
                functions: (state.functions || []).concat([action.func])
			};
		case STRUCTURE_ADDED:
			return {
				...state,
                structures: (state.structures || []).concat([action.struc])
			};
		case ACTIVITY_ADDED:
			return {
				...state,
                activities: (state.activities || []).concat([action.act])
			};
		case CONTEXT_ADDED:
			return {
				...state,
                contexts: (state.contexts || []).concat([action.con])
			};
        case DELETE_FUNCTION:
            return {
                ...state,
                functions: state.functions.filter(f => f.id !== action.functionId)
            };
        case DELETE_STRUCTURE:
            return {
                ...state,
                structures: state.structures.filter(s => s.id !== action.structureId)
            };
        case DELETE_ACTIVITY:
            return {
                ...state,
                activities: state.activities.filter(a => a.id !== action.activityId)
            };
        case DELETE_CONTEXT:
            return {
                ...state,
                contexts: state.contexts.filter(c => c.id !== action.contextId)
            };
        case UPDATE_FIELD_FUNCTION:
            return {
                ...state,
                functions: state.functions.map(f => {
                    if(f.id === action.functionId) {
                        f.isDirty = true;
                        f[action.key] = action.value;
                    }
                    return f;
                })
            };
        case UPDATE_FIELD_STRUCTURE:
            return {
                ...state,
                structures: state.structures.map(s => {
                    if(s.id === action.structureId) {
                        s.isDirty = true;
                        s[action.key] = action.value;
                    }
                    return s;
                })
            };
        case UPDATE_FIELD_ACTIVITY:
            return {
                ...state,
                activities: state.activities.map(a => {
                    if(a.id === action.activityId) {
                        a.isDirty = true;
                        a[action.key] = action.value;
                    }
                    return a;
                })
            };
        case UPDATE_FIELD_CONTEXT:
            return {
                ...state,
                contexts: state.contexts.map(c => {
                    if(c.id === action.contextId) {
                        c.isDirty = true;
                        c[action.key] = action.value;
                    }
                    return c;
                })
            };
        case UPDATE_FIELD_FUNCTION_VALUE:
            return {
                ...state,
                functions: state.functions.map(f => {
                    if(f.id === action.functionId) {
                        f.isDirty = true;
                        f.value[action.key] = action.value;
                    }
                    return f;
                })
            };
        case UPDATE_FIELD_STRUCTURE_VALUE:
            return {
                ...state,
                structures: state.structures.map(s => {
                    if(s.id === action.structureId) {
                        s.isDirty = true;
                        s.value[action.key] = action.value;
                    }
                    return s;
                })
            };
        case UPDATE_FIELD_ACTIVITY_VALUE:
            return {
                ...state,
                activities: state.activities.map(a => {
                    if(a.id === action.activityId) {
                        a.isDirty = true;
                        a.value[action.key] = action.value;
                    }
                    return a;
                })
            };
        case UPDATE_FIELD_CONTEXT_VALUE:
            return {
                ...state,
                contexts: state.contexts.map(c => {
                    if(c.id === action.contextId) {
                        c.isDirty = true;
                        c.value[action.key] = action.value;
                    }
                    return c;
                })
            };
        default:
            return state;
    }
    
    return state;
}
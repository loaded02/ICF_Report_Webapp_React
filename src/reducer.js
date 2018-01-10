import auth from './reducers/auth';
import { combineReducers } from 'redux';
import common from './reducers/common';
import profile from './reducers/profile';
import home from './reducers/home';
import settings from './reducers/settings';
import patientEditor from './reducers/patientEditor';
import patientList from './reducers/patientList';
import therapistEditor from './reducers/therapistEditor';
import therapistList from './reducers/therapistList';
import code from './reducers/code';
import editor from './reducers/editor';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    auth,
    common,
    profile,
    home,
    settings,
    patientEditor,
    patientList,
    therapistEditor,
    therapistList,
    code,
    editor,
    router: routerReducer
});
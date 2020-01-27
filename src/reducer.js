import auth from './reducers/auth';
import { combineReducers } from 'redux';
import common from './reducers/common';
import home from './reducers/home';
import settings from './reducers/settings';
import code from './reducers/code';
import codeForm from './reducers/codeForm';
import editor from './reducers/editor';
import editorSideNav from './reducers/editorSideNav';
import { connectRouter } from 'connected-react-router'

const createRootReducer = (history) => combineReducers({
    auth,
    common,
    home,
    settings,
    code,
    codeForm,
    editor,
    editorSideNav,
    router: connectRouter(history)
});

export default createRootReducer
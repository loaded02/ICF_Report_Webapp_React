import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {store, history} from './store';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-widgets/dist/css/react-widgets.css';

import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';

import App from './components/App';

ReactDOM.render((
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/" component={App} />
            </Switch>
        </ConnectedRouter>
    </Provider>
), document.getElementById('root'));

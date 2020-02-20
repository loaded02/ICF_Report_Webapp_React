import React, { Component } from 'react';
import {connect} from 'react-redux';
import { APP_LOAD } from '../constants/actionTypes';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './Header';
import NoMatch from './NoMatch';
import Home from './home';
import Login from '../components/Login';
import Register from '../components/Register';
import Editor from './editor/index';
import Settings from '../components/Settings';
import Code from '../components/code/index';
import agent from '../agent';
import ProtectedRoute from '../utils/ProtectedRoute';

const mapStateToProps = state => ({
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
    onLoad: (payload, token) =>
        dispatch({ type: APP_LOAD, payload, token, skipTracking: true })
});

class App extends Component {

    componentDidMount() {
        const token = window.localStorage.getItem('jwt');
        if (token) {
            agent.setToken(token);
        }

        this.props.onLoad(token ? agent.Auth.current() : null, token);
    }

    render() {
        if (this.props.appLoaded) {
            return (
                <div>
                    <Header
                        appName={this.props.appName}
                        currentUser={this.props.currentUser} />
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <ProtectedRoute path="/editor/:id" component={Editor} currentUser={this.props.currentUser}/>
                        <ProtectedRoute path="/editor" component={Editor} currentUser={this.props.currentUser}/>
                        <ProtectedRoute path="/code" component={Code} currentUser={this.props.currentUser}/>
                        <ProtectedRoute path="/settings" component={Settings} currentUser={this.props.currentUser}/>
                        <Route component={NoMatch} />
                    </Switch>
                </div>
            );
        }
        return (
            <div>
                <Header
                    appName={this.props.appName}
                    currentUser={this.props.currentUser}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

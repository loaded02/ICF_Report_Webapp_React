import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Collapse, Navbar, NavbarToggler,UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem} from 'reactstrap';
import logo from '../images/logo.svg';
import {GOTO, LOGOUT} from "../constants/actionTypes";
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
    onClickLogout: () => dispatch({ type: LOGOUT }),
    onGoTo: (payload) =>
        dispatch({ type: GOTO, payload })
});

const LoggedOutView = props => {
    if (!props.currentUser) {
        return (
            <ul className="ml-auto navbar-nav">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link">Sign in</Link>
                </li>
                <li className="nav-item">
                    <Link to="/register" className="nav-link">Sign up</Link>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="https://loaded02.github.io/ICF_Report_Webapp/" target="_blank"
                       rel="noopener noreferrer">Blog</a>
                </li>
            </ul>
        );
    }
    return null;
};

const LoggedInView = props => {
    if (props.currentUser) {
        return (
            <ul className="ml-auto navbar-nav">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/editor" className="nav-link">New Report</Link>
                </li>
                <li className="nav-item">
                    <Link to="/code" className="nav-link">Codes</Link>
                </li>
                <UncontrolledDropdown>
                    <DropdownToggle nav caret>
                        {props.currentUser.username}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => props.onGoTo(`/@${props.currentUser.username}`)}>
                            My Company
                        </DropdownItem>
                        <DropdownItem onClick={() => props.onGoTo('/settings')}>
                            Settings
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={props.onClickLogout}>
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                <li className="nav-item">
                    <a className="nav-link" href="https://loaded02.github.io/ICF_Report_Webapp/" target="_blank"
                       rel="noopener noreferrer">Blog</a>
                </li>
            </ul>
        )
    }
    return null;
};

class Header extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        return (
            <div>
                <Navbar color="dark" dark expand="md">
                    <Link to="/" className="navbar-brand mr-auto">
                        <img src={logo} className="App-logo" alt="logo" />
                        {' '}{this.props.appName.toUpperCase()}
                    </Link>
                    <NavbarToggler onClick={this.toggle} className="mr-2"/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <LoggedOutView currentUser={this.props.currentUser} />
                        <LoggedInView currentUser={this.props.currentUser}
                            onGoTo={this.props.onGoTo}
                            onClickLogout={this.props.onClickLogout}/>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default connect(() => ({}), mapDispatchToProps)(Header);

import React, {Component} from 'react';
import {connect} from 'react-redux';
import agent from '../../agent';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col,
    Card, CardBody, Button, Alert} from 'reactstrap';
import classnames from 'classnames';
import PatientEditor from './PatientEditor';
import PatientList from './PatientList';
import TherapistEditor from './TherapistEditor';
import TherapistList from './TherapistList';
import {
    PROFILE_PAGE_LOADED,
    PROFILE_PAGE_UNLOADED,
    PATIENT_EDITOR_PAGE_TOGGLED,
    THERAPIST_EDITOR_PAGE_TOGGLED,
    GOTO
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
    patients: state.patientList.patients,
    therapists: state.therapistList.therapists,
    profile: state.profile.profile,
    successId: state.profile.successId
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload => dispatch({ type: PROFILE_PAGE_LOADED, payload }),
    onUnload: () => dispatch({ type: PROFILE_PAGE_UNLOADED }),
    onTogglePatientEditor: () => dispatch({ type: PATIENT_EDITOR_PAGE_TOGGLED }),
    onToggleTherapistEditor: () => dispatch({ type: THERAPIST_EDITOR_PAGE_TOGGLED }),
    onGoto: payload => dispatch({type: GOTO, payload})
});

class Profile extends Component {
    constructor() {
        super();

        this.toggleTab = this.toggleTab.bind(this);
        this.state = {
            activeTab: '1'
        };
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    componentWillMount() {
        this.props.onLoad(Promise.all([
            agent.Profile.get(this.props.match.params.username),
            agent.Patient.all(),
            agent.Therapist.all()
        ]));
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        return (
            <div className="container main">
                <h1>Your Company</h1>
                <Nav className="navbar--settings">
                    <NavItem>
                        <Button color="secondary" outline onClick={this.props.onTogglePatientEditor}>Add Patient</Button>{' '}
                        <Button color="secondary" outline onClick={this.props.onToggleTherapistEditor}>Add Therapist</Button>{' '}
                        <Button color="secondary" outline onClick={() => this.props.onGoto('/settings')}>Edit Settings</Button>
                    </NavItem>
                </Nav>
                <Card>
                    <CardBody>
                        {this.props.successId ? <Alert color="success">Action successfull. Id:{this.props.successId}</Alert> : null}
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggleTab('1'); }}>
                                    My Patients
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                    onClick={() => { this.toggleTab('2'); }}>
                                    My Therapists
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent className="tab-persons" activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="12">
                                        <PatientList patients={this.props.patients}/>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="12">
                                        <TherapistList therapists={this.props.therapists}/>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
                <PatientEditor/>
                <TherapistEditor/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
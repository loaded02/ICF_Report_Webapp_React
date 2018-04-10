import React, {Component} from 'react';
import {Row, Col, Form, FormGroup, Label, Input} from 'reactstrap';
import {connect} from 'react-redux';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import {DateTimePicker} from 'react-widgets';
import './Editor.css';
import SideNav from './SideNav';
import FunctionList from './FunctionList';
import agent from '../../agent';
import ListErrors from '../ListErrors';
import PatientElement from './PatientElement';
import TherapistElement from './TherapistElement';
import {
	EDITOR_PAGE_LOADED,
	EDITOR_PAGE_UNLOADED,
	UPDATE_FIELD_REPORT,
	GOTO,
    FUNCTION_ADDED,
    STRUCTURE_ADDED,
    ACTIVITY_ADDED,
    CONTEXT_ADDED
} from "../../constants/actionTypes";

Moment.locale('de');
momentLocalizer();

const mapStateToProps = state => ({
    ...state.editor,
    sideNav: state.editorSideNav
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({type: EDITOR_PAGE_LOADED, payload}),
    onUnload: () =>
        dispatch({ type: EDITOR_PAGE_UNLOADED }),
	onUpdateField: (key, value) =>
		dispatch({ type: UPDATE_FIELD_REPORT, key, value }),
	onGoto: payload =>
        dispatch({type: GOTO, payload}),
    onAddFunction: func =>
        dispatch({type: FUNCTION_ADDED, func: func}),
    onAddStructure: struc =>
        dispatch({type: STRUCTURE_ADDED, struc: struc}),
    onAddActivity: act =>
        dispatch({type: ACTIVITY_ADDED, act: act}),
    onAddContext: con =>
        dispatch({type: CONTEXT_ADDED, con: con}),
});

class Editor extends Component {
	
	constructor() {
		super();
		
		const updateFieldEvent =
			key => ev => this.props.onUpdateField(key, ev.target.value);
		this.changeType = updateFieldEvent('type');
		this.changeFreeText = updateFieldEvent('freeText');
		this.changeDate = ev => {
			this.props.onUpdateField('date', ev);
		};

        this.addFunction = (type) => {
            const obj = {
                id: `new_${Math.floor((Math.random() * 1000) + 1)}`,
                code: {
                    id: ''
                },
                codeId: '',
                description: '',
                value: {
                    value: NaN,
                    performance: NaN,
                    capacity: NaN,
                    extend: NaN,
                    nature: NaN,
                    location: NaN
                },
                sourceOfInfo: [],
                kind: type
            };
            switch (type) {
                case 'FUNCTION':
                    this.props.onAddFunction(obj);
                    break;
                case 'STRUCTURE':
                    this.props.onAddStructure(obj);
                    break;
                case 'ACTIVITY':
                    this.props.onAddActivity(obj);
                    break;
                case 'CONTEXT':
                    this.props.onAddContext(obj);
                    break;
                default:
            }
        };
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.newReport) { // successful update/insert
            this.props.functions.forEach(func => {
               this.updateFunctions(nextProps.newReport.id, func);
            });
            this.props.structures.forEach(struc => {
                this.updateFunctions(nextProps.newReport.id, struc);
            });
            this.props.activities.forEach(act => {
                this.updateFunctions(nextProps.newReport.id, act);
            });
            this.props.contexts.forEach(con => {
                this.updateFunctions(nextProps.newReport.id, con);
            });
            this.props.onUnload();
            this.props.onGoto('/');
        }
		if (this.props.match.params.id !== nextProps.match.params.id) {
			const promises = [
				agent.Code.all()
			];
			if (nextProps.match.params.id) {
				promises.push(agent.Report.get(this.props.match.params.id));
			}
			this.props.onUnload();
			this.props.onLoad(Promise.all(promises));
		}
	}

    updateFunctions(reportId, func) {
        if (typeof func.id === 'string' && func.id.includes('new_')) {
            agent.Function.create(reportId, func);
        }
        else if (func.hasOwnProperty('isDirty') && func.isDirty) {
            agent.Function.update(reportId, func, func.id);
        }
    }

    componentWillMount() {
		const promises = [
			agent.Code.all()
		];
		if (this.props.match.params.id) {
            promises.push(agent.Report.get(this.props.match.params.id));
            promises.push(agent.Function.all(this.props.match.params.id, 'FUNCTION'));
            promises.push(agent.Function.all(this.props.match.params.id, 'STRUCTURE'));
            promises.push(agent.Function.all(this.props.match.params.id, 'ACTIVITY'));
            promises.push(agent.Function.all(this.props.match.params.id, 'CONTEXT'));
        }
		this.props.onLoad(Promise.all(promises));
    }

    componentWillUnmount() {
        this.props.onUnload();
    }
    
    get hasReport() {
        return this.props.reportId && this.props.reportId !== '';
    }
    
    render() {
        return (
            <div className="container main">
                <SideNav/>
                <h1>{this.hasReport ? 'Update Report' : 'Create A New Report'}</h1>
                <Form className="reportForm">
                    <ListErrors errors={this.props.errors} />
                    <ListErrors errors={this.props.sideNav.errors} />
                    <FormGroup row>
                        <Label for="type" sm={2}>Type</Label>
                        <Col sm={10}>
                            <Input type="text" name="type" id="type" placeholder="Type"
                                   value={this.props.type}
                                   onChange={this.changeType}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="date" sm={2}>Date</Label>
                        <Col sm={10}>
                            <DateTimePicker
                                name="date" id="date"
                                format='DD.MM.YYYY'
                                time={false}
                                placeholder="dd.mm.yyyy"
                                value={this.props.date}
                                onChange={this.changeDate}
                            />
                        </Col>
                    </FormGroup>
                    <PatientElement row/>
                    <TherapistElement row/>
                    <hr/>

                    <section>
                        <Row className="justify-content-between function--heading">
                            <h5>Body Functions</h5>
                            <button type="button" className="close" title="add" aria-label="Add"
                                onClick={() => this.addFunction('FUNCTION')}>
                                <i className="fa fa-plus" aria-hidden="true"/>
                            </button>
                        </Row>
                        <FunctionList functions={this.props.functions} kind="FUNCTION"/>
                    </section>
                    <section>
                        <Row className="justify-content-between function--heading">
                            <h5>Body Structures</h5>
                            <button type="button" className="close" title="add" aria-label="Add"
                                    onClick={() => this.addFunction('STRUCTURE')}>
                                <i className="fa fa-plus" aria-hidden="true"/>
                            </button>
                        </Row>
                        <FunctionList functions={this.props.structures} kind="STRUCTURE"/>
                    </section>
                    <section>
                        <Row className="justify-content-between function--heading">
                            <h5>Activities and Participation</h5>
                            <button type="button" className="close" title="add" aria-label="Add"
                                    onClick={() => this.addFunction('ACTIVITY')}>
                                <i className="fa fa-plus" aria-hidden="true"/>
                            </button>
                        </Row>
                        <FunctionList functions={this.props.activities} kind="ACTIVITY"/>
                    </section>
                    <section>
                        <Row className="justify-content-between function--heading">
                            <h5>Context Factors</h5>
                            <button type="button" className="close" title="add" aria-label="Add"
                                    onClick={() => this.addFunction('CONTEXT')}>
                                <i className="fa fa-plus" aria-hidden="true"/>
                            </button>
                        </Row>
                        <FunctionList functions={this.props.contexts} kind="CONTEXT"/>
                    </section>

                    <hr/>
                    <FormGroup row className="editor--freetext">
                        <Label for="freeText" sm={2}>Free Text</Label>
                        <Col sm={10}>
                            <Input type="textarea" name="freeText" id="freeText"
                                   placeholder="Further description..."
                                   value={this.props.freeText}
                                   onChange={this.changeFreeText}/>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
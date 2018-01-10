import React, {Component} from 'react';
import {Button, Row, Col, Form, FormGroup, Label, Input} from 'reactstrap';
import {connect} from 'react-redux';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import {DateTimePicker} from 'react-widgets';
import './Editor.css';
import FunctionList from './FunctionList';
import agent from '../../agent';
import ListErrors from '../ListErrors';
import {
	EDITOR_PAGE_LOADED,
	REPORT_SUBMITTED,
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
    ...state.editor
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({type: EDITOR_PAGE_LOADED, payload}),
    onSubmit: report =>
        dispatch({ type: REPORT_SUBMITTED, payload: report }),
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
		this.changePatientId = updateFieldEvent('patientId');
		this.changeTherapistId = updateFieldEvent('therapistId');
		this.changeFreeText = updateFieldEvent('freeText');
		this.changeDate = ev => {
			this.props.onUpdateField('date', ev);
		};
		
		this.submitForm = ev => {
			ev.preventDefault();
			
			const report = {
				type: this.props.type,
				patientId: this.props.patientId,
				therapistId: this.props.therapistId,
				date: this.props.date && Moment(this.props.date).isValid() ? Moment(this.props.date).format('YYYY-MM-DD') : null,
				freeText: this.props.freeText
			};
			
			const promise = this.hasReport ?
				agent.Report.update(report, this.props.reportId) :
				agent.Report.create(report);
			this.props.onSubmit(promise);
		};

		this.createPdf = (ev) => {
		    ev.preventDefault();

		    console.log('Create Pdf.');
			const a = document.createElement("a");
			document.body.appendChild(a);
			a.style = "display: none";
			
			const report = {
				type: this.props.type,
				patient: this.props.patients.find(p => p.id === this.props.patientId),
				therapist: this.props.therapists.find(t => t.id === this.props.therapistId),
				date: this.props.date && Moment(this.props.date).isValid() ? Moment(this.props.date).format('YYYY-MM-DD') : null,
				freeText: this.props.freeText,
				functions: this.props.functions.map(f => {return {...f, code: this.props.codes.find(code => code.id == f.codeId)}}),
				structures: this.props.structures.map(s => {return {...s, code: this.props.codes.find(code => code.id == s.codeId)}}),
				activities: this.props.activities.map(a => {return {...a, code: this.props.codes.find(code => code.id == a.codeId)}}),
				contexts: this.props.contexts.map(c => {return {...c, code: this.props.codes.find(code => code.id == c.codeId)}})
			};
			
			// File Dump
			const json = JSON.stringify(report),
				blob = new Blob([json], {type: "application/json"}),
				url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = "dump.json";
			a.click();
			
			window.URL.revokeObjectURL(url);
			
			// REST Call
/*			agent.Report.getPdf(report).then(res => {
				let filename = "";
				const disposition = res.header['content-disposition'];
				if (disposition && disposition.indexOf('attachment') !== -1) {
					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
					const matches = filenameRegex.exec(disposition);
					if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
				}
				const blob = new Blob([res.body], {type: res.type});
				if (typeof window.navigator.msSaveBlob !== 'undefined') {
					// IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
					window.navigator.msSaveBlob(blob, filename);
				} else {
					const URL = window.URL || window.webkitURL;
					const downloadUrl = URL.createObjectURL(blob);
					
					if (filename) {
						// use HTML5 a[download] attribute to specify filename
						const a = document.createElement("a");
						// safari doesn't support this yet
						if (typeof a.download === 'undefined') {
							//window.location = downloadUrl;
							window.open(downloadUrl, '_blank');
						} else {
							a.href = downloadUrl;
							a.download = filename;
							document.body.appendChild(a);
							a.setAttribute("target","_blank");
							a.click();
						}
					} else {
						//window.location = downloadUrl;
						window.open(downloadUrl, '_blank');
					}
					
					setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
				}
			})*/
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
				agent.Patient.all(),
				agent.Therapist.all(),
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
			agent.Patient.all(),
			agent.Therapist.all(),
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
        let patients = [(<option key={-1} value={null}>Choose...</option>)];
        if (this.props.patients) {
            patients.push(...this.props.patients.map(patient => {
                return (
                    <option key={patient.id} value={patient.id}>{patient.surname}</option>
                )
            }));
        }
        let therapists = [(<option key={-1} value={null}>Choose...</option>)];
        if (this.props.therapists) {
            therapists.push(...this.props.therapists.map(therapist => {
                return (
                    <option key={therapist.id} value={therapist.id}>{therapist.surname}</option>
                )
            }));
        }

        return (
            <div className="container main">
                <h1>{this.hasReport ? 'Update Report' : 'Create A New Report'}</h1>
                <Form onSubmit={this.submitForm} className="reportForm">
                    <ListErrors errors={this.props.errors} />
                    <FormGroup row>
                        <Label for="type" sm={2}>Type</Label>
                        <Col sm={10}>
                            <Input type="text" name="type" id="type" placeholder="Type"
                                   value={this.props.type}
                                   onChange={this.changeType}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="patient" sm={2}>Patient</Label>
                        <Col sm={10}>
                            <Input type="select" name="patientId" id="patient"
                                   value={this.props.patientId}
                                   onChange={this.changePatientId}>
                                {patients}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="therapist" sm={2}>Therapist</Label>
                        <Col sm={10}>
                            <Input type="select" name="therapistId" id="therapist"
                                   value={this.props.therapistId}
                                   onChange={this.changeTherapistId}>
                                {therapists}
                            </Input>
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
                    <hr/>

                    <section>
                        <Row className="justify-content-between function--heading">
                            <h5>Body Functions</h5>
                            <button type="button" className="close" aria-label="Add"
                                onClick={() => this.addFunction('FUNCTION')}>
                                <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                        </Row>
                        <FunctionList functions={this.props.functions} kind="FUNCTION"/>
                    </section>
                    <section>
                        <Row className="justify-content-between function--heading">
                            <h5>Body Structures</h5>
                            <button type="button" className="close" aria-label="Add"
                                    onClick={() => this.addFunction('STRUCTURE')}>
                                <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                        </Row>
                        <FunctionList functions={this.props.structures} kind="STRUCTURE"/>
                    </section>
                    <section>
                        <Row className="justify-content-between function--heading">
                            <h5>Activities and Participation</h5>
                            <button type="button" className="close" aria-label="Add"
                                    onClick={() => this.addFunction('ACTIVITY')}>
                                <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                        </Row>
                        <FunctionList functions={this.props.activities} kind="ACTIVITY"/>
                    </section>
                    <section>
                        <Row className="justify-content-between function--heading">
                            <h5>Context Factors</h5>
                            <button type="button" className="close" aria-label="Add"
                                    onClick={() => this.addFunction('CONTEXT')}>
                                <i className="fa fa-plus" aria-hidden="true"></i>
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
                    <FormGroup check row>
                        <Col sm={{size:10, offset:2}}>
                            <Button color="primary" type="submit"
									disabled={this.props.inProgress}>
								{this.hasReport ? 'Save' : 'Add'}</Button>{' '}
                            <Button color="secondary" type="button"
                                onClick={this.createPdf}>Create PDF</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
import React, {Component} from 'react';
import {Row, Col, FormGroup, Label, Input, Card, CardBody} from 'reactstrap';
import FunctionValue from './FunctionValue';
import StructureValue from './StructureValue';
import ActivityValue from './ActivityValue';
import ContextValue from './ContextValue';
import {connect} from 'react-redux';
import {
    DELETE_FUNCTION,
    DELETE_STRUCTURE,
    DELETE_ACTIVITY,
    DELETE_CONTEXT,
    UPDATE_FIELD_FUNCTION,
    UPDATE_FIELD_STRUCTURE,
    UPDATE_FIELD_ACTIVITY,
    UPDATE_FIELD_CONTEXT
} from "../../constants/actionTypes";
import agent from "../../agent";

const mapStateToProps = state => ({
    ...state,
    ...state.editor
});

const mapDispatchToProps = dispatch => ({
    onDeleteFunction: (payload, functionId) =>
        dispatch({ type: DELETE_FUNCTION, payload, functionId }),
    onDeleteStructure: (payload, structureId) =>
        dispatch({ type: DELETE_STRUCTURE, payload, structureId }),
    onDeleteActivity: (payload, activityId) =>
        dispatch({ type: DELETE_ACTIVITY, payload, activityId }),
    onDeleteContext: (payload, contextId) =>
        dispatch({ type: DELETE_CONTEXT, payload, contextId }),
    onUpdateFieldFunction: (key, value, functionId) =>
        dispatch({ type: UPDATE_FIELD_FUNCTION, key, value, functionId }),
    onUpdateFieldStructure: (key, value, structureId) =>
        dispatch({ type: UPDATE_FIELD_STRUCTURE, key, value, structureId }),
    onUpdateFieldActivity: (key, value, activityId) =>
        dispatch({ type: UPDATE_FIELD_ACTIVITY, key, value, activityId }),
    onUpdateFieldContext: (key, value, contextId) =>
        dispatch({ type: UPDATE_FIELD_CONTEXT, key, value, contextId })
});

const ValueElement = props => {
    switch (props.kind) {
        case 'FUNCTION':
            return (
                <FunctionValue value={props.value} funcId={props.funcId}/>
            );
        case 'STRUCTURE':
            return (
                <StructureValue value={props.value} funcId={props.funcId}/>
            );
        case 'ACTIVITY':
            return (
                <ActivityValue value={props.value} funcId={props.funcId}/>
            );
        case 'CONTEXT':
            return (
                <ContextValue value={props.value} funcId={props.funcId}/>
            );
        default:
            return null;
    }
};

class FunctionElement extends Component {
    constructor() {
        super();

        this.removeFunction = () => {
            let payload = null;
            if (!(typeof this.props.func.id === 'string' && this.props.func.id.includes('new_'))) {
                payload = agent.Function.remove(this.props.reportId, this.props.func.id);
            }
            switch (this.props.kind) {
                case 'FUNCTION':
                    this.props.onDeleteFunction(payload, this.props.func.id);
                    break;
                case 'STRUCTURE':
                    this.props.onDeleteStructure(payload, this.props.func.id);
                    break;
                case 'ACTIVITY':
                    this.props.onDeleteActivity(payload, this.props.func.id);
                    break;
                case 'CONTEXT':
                    this.props.onDeleteContext(payload, this.props.func.id);
                    break;
                default:
            }
        };

        const updateFieldEvent =
            key => ev => {
                switch (this.props.kind) {
                    case 'FUNCTION':
                        this.props.onUpdateFieldFunction(key, ev.target.value, this.props.func.id);
                        break;
                    case 'STRUCTURE':
                        this.props.onUpdateFieldStructure(key, ev.target.value, this.props.func.id);
                        break;
                    case 'ACTIVITY':
                        this.props.onUpdateFieldActivity(key, ev.target.value, this.props.func.id);
                        break;
                    case 'CONTEXT':
                        this.props.onUpdateFieldContext(key, ev.target.value, this.props.func.id);
                        break;
                    default:
                }
            };
        this.changeCodeId = updateFieldEvent('codeId').bind(this);
        this.changeDescription = updateFieldEvent('description').bind(this);
    }

    getCodeFromId = codeId => {
        const empty = {
            title: 'Empty  Title',
            description: 'Empty Description'
        };
        if (this.props.codes && this.props.codes.length > 0) {
            const found = this.props.codes.find(c => c.id == codeId);
            return found !== undefined ? found : empty;
        }else {
            return empty;
        }
    };

    toggleCheckbox = ev => {
        const sourceOfInfo = this.props.func.sourceOfInfo;
        if (sourceOfInfo) {
            const labelIndex = sourceOfInfo.findIndex(item => item === ev.target.value);
            if (labelIndex === -1)
                sourceOfInfo.push(ev.target.value);
            else
                sourceOfInfo.splice(labelIndex, 1);
            switch (this.props.kind) {
                case 'FUNCTION':
                    this.props.onUpdateFieldFunction('sourceOfInfo', sourceOfInfo, this.props.func.id);
                    break;
                case 'STRUCTURE':
                    this.props.onUpdateFieldStructure('sourceOfInfo', sourceOfInfo, this.props.func.id);
                    break;
                case 'ACTIVITY':
                    this.props.onUpdateFieldActivity('sourceOfInfo', sourceOfInfo, this.props.func.id);
                    break;
                case 'CONTEXT':
                    this.props.onUpdateFieldContext('sourceOfInfo', sourceOfInfo, this.props.func.id);
                    break;
                default:
            }
        }
    };

    isCheckboxChecked = label => {
        if (this.props.func.sourceOfInfo) {
            return this.props.func.sourceOfInfo.find(item => item === label) !== undefined;
        }
        return false;
    };

    collapse = ev => {
        const i = ev.target.tagName.toUpperCase() === 'I' ? ev.target : ev.target.getElementsByTagName('i')[0];
        const style = document.getElementById(`detailed--info__${this.props.func.id}`).style;
        if (i.className.includes('down')) {
            style.display = 'block';
            i.className = i.className.replace('down', 'up');
        } else {
            style.display = 'none';
            i.className = i.className.replace('up', 'down');
        }
    };

    render() {
        const codes = [(<option key={-1} value={null}>Choose...</option>)];
        if (this.props.codes) {
            codes.push(...this.props.codes.map(code => {
                return (
                    <option key={code.id} value={code.id}>{code.code}</option>
                )
            }));
        }
        return (
            <Row className="function--element">
                <Col>
                    <Card className="function--card">
                        <CardBody>
                        <div className="d-flex justify-content-end">
                            <button type="button" className="close" title="remove" aria-label="Close"
                                    onClick={this.removeFunction.bind(this)}>
                                <i className="fa fa-times" aria-hidden="true"/>
                            </button>
                        </div>
                            <Row className="function--value">
                                <FormGroup className="col-md-2">
                                    <Label for="code" hidden>Code</Label>
                                    <Input type="select" name="codeId" id="code"
                                           value={this.props.func.codeId}
                                           onChange={this.changeCodeId}>
                                        {codes}
                                    </Input>
                                </FormGroup>
                                <span className="col-md-4">{this.getCodeFromId(this.props.func.codeId).title}</span>
                                <ValueElement kind={this.props.kind} value={this.props.func.value} funcId={this.props.func.id}/>
                            </Row>

                            <div className="d-flex justify-content-end">
                                <button type="button" className="close" title="toggle" aria-label="Close"
                                        onClick={this.collapse}>
                                    <i className="fa fa-angle-double-down" aria-hidden="true"/>
                                </button>
                            </div>
                            <div id={`detailed--info__${this.props.func.id}`}>
                                <Row className="function--info">
                                    <Col>
                                        <Row>
                                            <Col><b>{this.getCodeFromId(this.props.func.codeId).description}</b></Col>
                                        </Row>
                                        <Row>
                                            <Col>Inclusions, Exclusions tbd</Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <FormGroup tag="fieldset" row className="function--sources">
                                    <Col>
                                        <Row>
                                            <Col>
                                                <legend>Sources of information</legend>
                                            </Col>
                                        </Row>
                                        <Row noGutters={false}>
                                            <Col xs="auto">
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input type="checkbox"
                                                               value="Case history"
                                                               defaultChecked={this.isCheckboxChecked("Case history")}
                                                               onChange={this.toggleCheckbox}/>{' '}
                                                        Case history
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                            <Col xs="auto">
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input type="checkbox"
                                                               value="Patient reported questionnaire"
                                                               defaultChecked={this.isCheckboxChecked("Patient reported questionnaire")}
                                                               onChange={this.toggleCheckbox}/>{' '}
                                                        Patient reported questionnaire
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                            <Col xs="auto">
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input type="checkbox"
                                                               value="Clinical examination"
                                                               defaultChecked={this.isCheckboxChecked("Clinical examination")}
                                                               onChange={this.toggleCheckbox}/>{' '}
                                                        Clinical examination
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                            <Col xs="auto">
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input type="checkbox"
                                                               value="Technical investigation"
                                                               defaultChecked={this.isCheckboxChecked("Technical investigation")}
                                                               onChange={this.toggleCheckbox}/>{' '}
                                                        Technical investigation
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                </FormGroup>
                            </div>

                            <FormGroup row className="function--description">
                                <Col>
                                    <Row>
                                        <Col>
                                            <Label for="description">Description of the problem</Label>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Input type="text" name="description" id="description"
                                                placeholder="Description"
                                                value={this.props.func.description}
                                                onChange={this.changeDescription}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </FormGroup>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FunctionElement);
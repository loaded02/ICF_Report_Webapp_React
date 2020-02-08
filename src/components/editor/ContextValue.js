import React, {Component} from 'react';
import {Row, Col, FormGroup, Label, Input} from 'reactstrap';
import {connect} from 'react-redux';
import {
    UPDATE_FIELD_CONTEXT_VALUE
} from "../../constants/actionTypes";

const mapStateToProps = state => ({
    ...state,
    ...state.editor
});

const mapDispatchToProps = dispatch => ({
    onUpdateFieldContextValue: (key, value, contextId) =>
        dispatch({ type: UPDATE_FIELD_CONTEXT_VALUE, key, value, contextId })
});

class ContextValue extends Component {
    constructor() {
        super();

        this.handleValueChange = ev => {
            const val = Number(ev.target.value)
            this.props.onUpdateFieldContextValue('value', val, this.props.funcId);
        };
    }

    render() {
        return (
            <FormGroup tag="fieldset" className="col-md-6">
                <Row noGutters={true}>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`severity_${this.props.funcId}`}
                                       value={4} checked={this.props.value.value === 4}
                                       onChange={this.handleValueChange}/>
                                +4
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`severity_${this.props.funcId}`}
                                       value={3} checked={this.props.value.value === 3}
                                       onChange={this.handleValueChange}/>
                                +3
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`severity_${this.props.funcId}`}
                                       value={2} checked={this.props.value.value === 2}
                                       onChange={this.handleValueChange}/>
                                +2
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`severity_${this.props.funcId}`}
                                       value={1} checked={this.props.value.value === 1}
                                       onChange={this.handleValueChange}/>
                                +1
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`severity_${this.props.funcId}`}
                                       value={0} checked={this.props.value.value === 0}
                                       onChange={this.handleValueChange}/>{' '}
                                0
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`severity_${this.props.funcId}`}
                                       value={-1} checked={this.props.value.value === -1}
                                       onChange={this.handleValueChange}/>{' '}
                                1
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`severity_${this.props.funcId}`}
                                       value={-2} checked={this.props.value.value === -2}
                                       onChange={this.handleValueChange}/>{' '}
                                2
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`severity_${this.props.funcId}`}
                                       value={-3} checked={this.props.value.value === -3}
                                       onChange={this.handleValueChange}/>{' '}
                                3
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`severity_${this.props.funcId}`}
                                       value={-4} checked={this.props.value.value === -4}
                                       onChange={this.handleValueChange}/>{' '}
                                4
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`severity_${this.props.funcId}`}
                                       value={8} checked={this.props.value.value === 8}
                                       onChange={this.handleValueChange}/>{' '}
                                8
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`severity_${this.props.funcId}`}
                                       value={9} checked={this.props.value.value === 9}
                                       onChange={this.handleValueChange}/>{' '}
                                9
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>
            </FormGroup>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextValue);
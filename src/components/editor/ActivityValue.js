import React, {Component} from 'react';
import {Row, Col, FormGroup, Label, Input} from 'reactstrap';
import {connect} from 'react-redux';
import {
    UPDATE_FIELD_ACTIVITY_VALUE
} from "../../constants/actionTypes";

const mapStateToProps = state => ({
    ...state,
    ...state.editor
});

const mapDispatchToProps = dispatch => ({
    onUpdateFieldActivityValue: (key, value, activityId) =>
        dispatch({ type: UPDATE_FIELD_ACTIVITY_VALUE, key, value, activityId })
});

class ActivityValue extends Component {
    constructor() {
        super();

        const handleValueChange = key => ev =>
            this.props.onUpdateFieldActivityValue(key, ev.target.value, this.props.funcId);
        this.changePerformance = handleValueChange('performance');
        this.changeCapacity = handleValueChange('capacity');
    }

    render() {
        return (
            <FormGroup tag="fieldset" className="col-md-6">
                <Row noGutters={true}>
                    <Col>
                        <legend>P</legend>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`performance_${this.props.funcId}`}
                                       value={0} checked={this.props.value.performance == 0}
                                       onChange={this.changePerformance}/>{' '}
                                0
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`performance_${this.props.funcId}`}
                                       value={1} checked={this.props.value.performance == 1}
                                       onChange={this.changePerformance}/>{' '}
                                1
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`performance_${this.props.funcId}`}
                                       value={2} checked={this.props.value.performance == 2}
                                       onChange={this.changePerformance}/>{' '}
                                2
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`performance_${this.props.funcId}`}
                                       value={3} checked={this.props.value.performance == 3}
                                       onChange={this.changePerformance}/>{' '}
                                3
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`performance_${this.props.funcId}`}
                                       value={4} checked={this.props.value.performance == 4}
                                       onChange={this.changePerformance}/>{' '}
                                4
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`performance_${this.props.funcId}`}
                                       value={8} checked={this.props.value.performance == 8}
                                       onChange={this.changePerformance}/>{' '}
                                8
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`performance_${this.props.funcId}`}
                                       value={9} checked={this.props.value.performance == 9}
                                       onChange={this.changePerformance}/>{' '}
                                9
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row noGutters={true}>
                    <Col>
                        <legend>C</legend>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`capacity_${this.props.funcId}`}
                                       value={0} checked={this.props.value.capacity == 0}
                                       onChange={this.changeCapacity}/>{' '}
                                0
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`capacity_${this.props.funcId}`}
                                       value={1} checked={this.props.value.capacity == 1}
                                       onChange={this.changeCapacity}/>{' '}
                                1
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`capacity_${this.props.funcId}`}
                                       value={2} checked={this.props.value.capacity == 2}
                                       onChange={this.changeCapacity}/>{' '}
                                2
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`capacity_${this.props.funcId}`}
                                       value={3} checked={this.props.value.capacity == 3}
                                       onChange={this.changeCapacity}/>{' '}
                                3
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`capacity_${this.props.funcId}`}
                                       value={4} checked={this.props.value.capacity == 4}
                                       onChange={this.changeCapacity}/>{' '}
                                4
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`capacity_${this.props.funcId}`}
                                       value={8} checked={this.props.value.capacity == 8}
                                       onChange={this.changeCapacity}/>{' '}
                                8
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`capacity_${this.props.funcId}`}
                                       value={9} checked={this.props.value.capacity == 9}
                                       onChange={this.changeCapacity}/>{' '}
                                9
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>
            </FormGroup>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityValue);
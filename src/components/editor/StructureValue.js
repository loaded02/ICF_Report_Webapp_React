import React, {Component} from 'react';
import {Row, Col, FormGroup, Label, Input} from 'reactstrap';
import {connect} from 'react-redux';
import {
    UPDATE_FIELD_STRUCTURE_VALUE
} from "../../constants/actionTypes";

const mapStateToProps = state => ({
    ...state,
    ...state.editor
});

const mapDispatchToProps = dispatch => ({
    onUpdateFieldStructureValue: (key, value, structureId) =>
        dispatch({ type: UPDATE_FIELD_STRUCTURE_VALUE, key, value, structureId })
});

class ContextValue extends Component {
    constructor() {
        super();

        const handleValueChange = key => ev =>
            this.props.onUpdateFieldStructureValue(key, ev.target.value, this.props.funcId);
        this.changeExtend = handleValueChange('extend');
        this.changeNature = handleValueChange('nature');
        this.changeLocation = handleValueChange('location');
    }

    render() {
        return (
            <FormGroup tag="fieldset" className="col-md-6">
                <Row noGutters={true}>
                    <Col>
                        <legend>Extend&nbsp;</legend>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`extend_${this.props.funcId}`}
                                       value={0} checked={this.props.value.extend == 0}
                                       onChange={this.changeExtend}/>{' '}
                                0
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`extend_${this.props.funcId}`}
                                       value={1} checked={this.props.value.extend == 1}
                                       onChange={this.changeExtend}/>{' '}
                                1
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`extend_${this.props.funcId}`}
                                       value={2} checked={this.props.value.extend == 2}
                                       onChange={this.changeExtend}/>{' '}
                                2
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`extend_${this.props.funcId}`}
                                       value={3} checked={this.props.value.extend == 3}
                                       onChange={this.changeExtend}/>{' '}
                                3
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`extend_${this.props.funcId}`}
                                       value={4} checked={this.props.value.extend == 4}
                                       onChange={this.changeExtend}/>{' '}
                                4
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`extend_${this.props.funcId}`}
                                       value={8} checked={this.props.value.extend == 8}
                                       onChange={this.changeExtend}/>{' '}
                                8
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`extend_${this.props.funcId}`}
                                       value={9} checked={this.props.value.extend == 9}
                                       onChange={this.changeExtend}/>{' '}
                                9
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row noGutters={true}>
                    <Col>
                        <legend>Nature&nbsp;</legend>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`nature_${this.props.funcId}`}
                                       value={0} checked={this.props.value.nature == 0}
                                       onChange={this.changeNature}/>{' '}
                                0
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`nature_${this.props.funcId}`}
                                       value={1} checked={this.props.value.nature == 1}
                                       onChange={this.changeNature}/>{' '}
                                1
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`nature_${this.props.funcId}`}
                                       value={2} checked={this.props.value.nature == 2}
                                       onChange={this.changeNature}/>{' '}
                                2
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`nature_${this.props.funcId}`}
                                       value={3} checked={this.props.value.nature == 3}
                                       onChange={this.changeNature}/>{' '}
                                3
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`nature_${this.props.funcId}`}
                                       value={4} checked={this.props.value.nature == 4}
                                       onChange={this.changeNature}/>{' '}
                                4
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`nature_${this.props.funcId}`}
                                       value={5} checked={this.props.value.nature == 5}
                                       onChange={this.changeNature}/>{' '}
                                5
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`nature_${this.props.funcId}`}
                                       value={6} checked={this.props.value.nature == 6}
                                       onChange={this.changeNature}/>{' '}
                                6
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`nature_${this.props.funcId}`}
                                       value={7} checked={this.props.value.nature == 7}
                                       onChange={this.changeNature}/>{' '}
                                7
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`nature_${this.props.funcId}`}
                                       value={8} checked={this.props.value.nature == 8}
                                       onChange={this.changeNature}/>{' '}
                                8
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`nature_${this.props.funcId}`}
                                       value={9} checked={this.props.value.nature == 9}
                                       onChange={this.changeNature}/>{' '}
                                9
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row noGutters={true}>
                    <Col>
                        <legend>Location&nbsp;</legend>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`location_${this.props.funcId}`}
                                       value={0} checked={this.props.value.location == 0}
                                       onChange={this.changeLocation}/>{' '}
                                0
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`location_${this.props.funcId}`}
                                       value={1} checked={this.props.value.location == 1}
                                       onChange={this.changeLocation}/>{' '}
                                1
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`location_${this.props.funcId}`}
                                       value={2} checked={this.props.value.location == 2}
                                       onChange={this.changeLocation}/>{' '}
                                2
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`location_${this.props.funcId}`}
                                       value={3} checked={this.props.value.location == 3}
                                       onChange={this.changeLocation}/>{' '}
                                3
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`location_${this.props.funcId}`}
                                       value={4} checked={this.props.value.location == 4}
                                       onChange={this.changeLocation}/>{' '}
                                4
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`location_${this.props.funcId}`}
                                       value={5} checked={this.props.value.location == 5}
                                       onChange={this.changeLocation}/>{' '}
                                5
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`location_${this.props.funcId}`}
                                       value={6} checked={this.props.value.location == 6}
                                       onChange={this.changeLocation}/>{' '}
                                6
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`location_${this.props.funcId}`}
                                       value={7} checked={this.props.value.location == 7}
                                       onChange={this.changeLocation}/>{' '}
                                7
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`location_${this.props.funcId}`}
                                       value={8} checked={this.props.value.location == 8}
                                       onChange={this.changeLocation}/>{' '}
                                8
                            </Label>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name={`location_${this.props.funcId}`}
                                       value={9} checked={this.props.value.location == 9}
                                       onChange={this.changeLocation}/>{' '}
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
import React, {Component} from 'react';
import {Col, FormGroup, Label, Input, Card, CardBody, CardHeader} from 'reactstrap';
import {connect} from 'react-redux';
import {
    UPDATE_FIELD_REPORT_THERAPIST
} from "../../constants/actionTypes";

const mapStateToProps = state => ({
    ...state.editor.therapist
});

const mapDispatchToProps = dispatch => ({
    onUpdateField: (key, value) =>
        dispatch({ type: UPDATE_FIELD_REPORT_THERAPIST, key, value })
});

class TherapistElement extends Component {
    constructor() {
        super();

        const updateFieldEvent =
            key => ev => this.props.onUpdateField(key, ev.target.value);
        this.changeName = updateFieldEvent('name');
        this.changeSurname = updateFieldEvent('surname');
        this.changeCompany = updateFieldEvent('company');
    }

    render() {
        return (
            <Card>
                <CardHeader>Therapist</CardHeader>
                <CardBody>
                    <FormGroup row>
                        <Label for="firstName" sm={2}>Name</Label>
                        <Col sm={10}>
                            <Input type="text" name="name" id="name" placeholder="Name"
                                   value={this.props.name}
                                   onChange={this.changeName}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="surname" sm={2}>Surname</Label>
                        <Col sm={10}>
                            <Input type="text" name="surname" id="surname" placeholder="Surname"
                                   value={this.props.surname}
                                   onChange={this.changeSurname}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="company" sm={2}>Company</Label>
                        <Col sm={10}>
                            <Input type="text" name="company" id="company" placeholder="Company"
                                   value={this.props.company}
                                   onChange={this.changeCompany}/>
                        </Col>
                    </FormGroup>
                </CardBody>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TherapistElement);
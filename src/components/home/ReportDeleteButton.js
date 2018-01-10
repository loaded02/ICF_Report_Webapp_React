import React from 'react';
import agent from '../../agent';
import { DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';
import { DELETE_REPORT } from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
    onClick: (payload, reportId) =>
        dispatch({ type: DELETE_REPORT, payload, reportId })
});

const ReportDeleteButton = props => {
    const del = ev => {
        ev.stopPropagation();
        ev.nativeEvent.stopImmediatePropagation();
        const payload = agent.Report.remove(props.reportId);
        props.onClick(payload, props.reportId);
    };

    return (
        <DropdownItem onClick={(ev) => del(ev)}>Remove</DropdownItem>
    );
};

export default connect(() => ({}), mapDispatchToProps)(ReportDeleteButton);
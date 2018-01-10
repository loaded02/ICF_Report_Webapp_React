import React from 'react';
import agent from '../../agent';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { DELETE_CODE } from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
    onClick: (payload, codeId) =>
        dispatch({ type: DELETE_CODE, payload, codeId })
});

const CodeDeleteButton = props => {
    const del = ev => {
        ev.stopPropagation();
        ev.nativeEvent.stopImmediatePropagation();
        const payload = agent.Code.remove(props.codeId);
        props.onClick(payload, props.codeId);
    };

    return (
        <Button type="button" outline color="danger"
                onClick={(ev) => del(ev)}>Remove</Button>
    );
};

export default connect(() => ({}), mapDispatchToProps)(CodeDeleteButton);
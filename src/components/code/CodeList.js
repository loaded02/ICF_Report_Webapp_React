import React from 'react';
import {ListGroup} from 'reactstrap';
import CodeDeleteButton from './CodeDeleteButton';
import { connect } from 'react-redux';
import {CODE_EDITOR_PAGE_TOGGLED} from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
    onClick: codeId =>
        dispatch({ type: CODE_EDITOR_PAGE_TOGGLED, codeId })
});

const CodeList = props => {
    //console.log('codelist', props)
    if(props.error) {
        //console.log(props.error)
        return (
            <div>Error {props.error}</div>
        )
    }
    if (!props.codes) {
        return (
            <div className="code-preview">Loading...</div>
        );
    }

    if (props.codes.length === 0) {
        return (
            <div className="code-preview">
                No codes are here... yet.
            </div>
        );
    }

    return (
        <ListGroup>
            {
                props.codes.map(code => {
                    return (
                        <div className="list-group-item list-group-item-action flex-column align-items-start"
                             key={code.id} onClick={() => props.onClick(code.id)}>
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{code.code}</h5>
                            </div>
                            <div className="d-flex w-100 justify-content-between">
                                <p className="mb-1">{code.title} - {code.description}</p>
                                <CodeDeleteButton codeId={code.id}/>
                            </div>
                        </div>
                    );
                })
            }
        </ListGroup>
    );
};

export default connect(() => ({}), mapDispatchToProps)(CodeList);
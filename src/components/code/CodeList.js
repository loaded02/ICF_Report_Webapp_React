import React from 'react';
import {ListGroup} from 'reactstrap';
import CodeDeleteButton from './CodeDeleteButton';
import { connect } from 'react-redux';
import {CODE_SELECTED} from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
    onClick: payload =>
        dispatch({ type: CODE_SELECTED, payload })
});

const CodeList = props => {
    console.log('codelist', props)
    if(props.error) {
        console.log(props.error)
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

    const select = (ev, code) => {
        Array.from(document.querySelectorAll('div[data-type="code-element"]'))
            .forEach(item => item.classList.remove('active'));
        document.getElementById(`code-element_${code.id}`).classList.toggle('active');
        props.onClick(code);
    };

    return (
        <ListGroup>
            {
                props.codes.map(code => {
                    return (
                        <div className="list-group-item list-group-item-action flex-column align-items-start"
                             data-type="code-element" id={`code-element_${code.id}`} key={code.id}
                             onClick={(ev) => select(ev, code)}>
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
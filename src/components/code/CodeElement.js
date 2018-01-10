import React from 'react';
import CodeDeleteButton from './CodeDeleteButton';
import { connect } from 'react-redux';
import {CODE_SELECTED} from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
    onClick: (payload, currentCode) =>
        dispatch({ type: CODE_SELECTED, payload, currentCode })
});

const CodeElement = props => {
    console.log('CodeElement: ' + props.code.id)

    const select = (ev) => {
        Array.from(document.querySelectorAll('div[data-type="code-element"]'))
            .forEach(item => item.classList.remove('active'));
        document.getElementById(`code-element_${props.code.id}`).classList.toggle('active');
        props.onClick(null, props.code);
    };

    return (
        <div className="list-group-item list-group-item-action flex-column align-items-start"
            data-type="code-element" id={`code-element_${props.code.id}`} key={props.code.id}
            onClick={(ev) => select(ev)}>
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{props.code.code}</h5>
            </div>
            <div className="d-flex w-100 justify-content-between">
                <p className="mb-1">{props.code.title} - {props.code.description}</p>
                <CodeDeleteButton codeId={props.code.id}/>
            </div>
        </div>
    )
};

export default connect(() => ({}), mapDispatchToProps)(CodeElement);
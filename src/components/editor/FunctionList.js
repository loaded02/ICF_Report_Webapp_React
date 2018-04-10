import React from 'react';
import {ListGroup} from 'reactstrap';
import FunctionElement from './FunctionElement';

const FunctionList = props => {
    //console.log('functionlist', props)
    if(props.error) {
        //console.log(props.error)
        return (
            <div>Error {props.error}</div>
        )
    }
    if (!props.functions) {
        return (
            <div className="function-preview">Loading...</div>
        );
    }

    if (props.functions.length === 0) {
        return (
            <div className="function-preview">
                No functions are here... yet.
            </div>
        );
    }

    return (
        <ListGroup>
            {
                props.functions.map(func => {
                    return (
                        <FunctionElement kind={props.kind} key={func.id} func={func}/>
                    );
                })
            }
        </ListGroup>
    );
};

export default FunctionList;
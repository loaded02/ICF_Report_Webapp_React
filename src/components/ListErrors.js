import React from 'react';
import {UncontrolledAlert} from 'reactstrap';

class ListErrors extends React.Component {
    render() {
        const errors = this.props.errors;
        if (errors) {
            return (
                <div>
                    {
                        Object.keys(errors).map(key => {
                            return (
                                <UncontrolledAlert color="danger" key={key}>
                                    {key} - {errors[key]}
                                </UncontrolledAlert>
                            );
                        })
                    }
                </div>
            );
        } else {
            return null;
        }
    }
}

export default ListErrors;
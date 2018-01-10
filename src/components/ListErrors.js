import React from 'react';
import {Alert} from 'reactstrap';

class ListErrors extends React.Component {
    render() {
        const errors = this.props.errors;
        if (errors) {
            return (
                <div>
                    {
                        Object.keys(errors).map(key => {
                            return (
                                <Alert color="danger" key={key}>
                                    {key} {errors[key]}
                                </Alert>
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
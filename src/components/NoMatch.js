import React, {Component} from 'react';
import {connect} from 'react-redux';

class NoMatch extends Component {

    render() {
        return (
			<div className="container main">
				<h1>No matching route for the given URL.</h1>
            </div>
        )
    }
}

export default connect(() => ({}), () => ({}))(NoMatch);
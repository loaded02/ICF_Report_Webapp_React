import React from 'react';
import Moment from 'moment';
import {ListGroup} from 'reactstrap';
import ReportButtonGroup from './ReportButtonGroup';

const ReportList = props => {
    if (props.error) {
        console.log(props.error)
        return (
            <div>Error {props.error}</div>
        )
    }
    if (!props.reports) {
        return (
            <div className="report-preview">Loading...</div>
        );
    }

    if (props.reports.length === 0) {
        return (
            <div className="report-preview">
                No reports are here... yet.
            </div>
        );
    }

    return (
        <ListGroup>
            {
                props.reports.map(report => {
                    return (
                        <div className="list-group-item list-group-item-action flex-column align-items-start"
                             key={report.id}>
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{report.type}</h5>
                            </div>
                            <div className="d-flex w-100 justify-content-between">
                                <p className="mb-1">{Moment(report.date).isValid() ? Moment(report.date).format('DD.MM.YYYY') : ''}</p>
                                <div className="mb-1">
                                    <ReportButtonGroup report={report}/>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </ListGroup>
    );
};

export default ReportList;
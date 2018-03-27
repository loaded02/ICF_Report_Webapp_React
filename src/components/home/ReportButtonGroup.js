import React, {Component} from 'react';
import ReportDeleteButton from './ReportDeleteButton';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {GOTO, REPORT_PDF_CREATED} from "../../constants/actionTypes";
import { connect } from 'react-redux';
import agent from '../../agent';

const mapStateToProps = state => ({
    ...state.home
});

const mapDispatchToProps = dispatch => ({
    onGoTo: (payload) =>
        dispatch({ type: GOTO, payload }),
    onCreatePdf: blob =>
        dispatch({type: REPORT_PDF_CREATED, payload: blob})
});

class ReportButtonGroup extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };

        this.downloadPdf = (ev, reportId) => {
            ev.stopPropagation();
            ev.nativeEvent.stopImmediatePropagation();
            this.props.onCreatePdf(agent.Report.getPdfFromDB(reportId));
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.blob) { //pdf created
            const res = nextProps.blob;
            let filename = "";
            const disposition = res.header['content-disposition'];
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
            }
            const blob = new Blob([res.body], {type: res.type});
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                window.navigator.msSaveBlob(blob, filename);
            } else {
                const URL = window.URL || window.webkitURL;
                const downloadUrl = URL.createObjectURL(blob);

                if (filename) {
                    // use HTML5 a[download] attribute to specify filename
                    const a = document.createElement("a");
                    // safari doesn't support this yet
                    if (typeof a.download === 'undefined') {
                        //window.location = downloadUrl;
                        window.open(downloadUrl, '_blank');
                    } else {
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.setAttribute("target","_blank");
                        a.click();
                    }
                } else {
                    //window.location = downloadUrl;
                    window.open(downloadUrl, '_blank');
                }

                setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
                this.props.onCreatePdf(null);
            }
        }
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        return(
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret color="success">
                    Actions
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={(ev) => this.downloadPdf(ev, this.props.report.id)}>
                        Create PDF</DropdownItem>
                    <DropdownItem onClick={() => this.props.onGoTo(`/editor/${this.props.report.id}`)}>
                        Edit</DropdownItem>
                    <DropdownItem disabled={true}>Duplicate</DropdownItem>
                    <DropdownItem divider />
                    <ReportDeleteButton reportId={this.props.report.id}/>
                </DropdownMenu>
            </ButtonDropdown>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportButtonGroup);
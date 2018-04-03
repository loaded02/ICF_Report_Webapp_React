import React, {Component} from 'react';
import './SideNav.css';
import {connect} from 'react-redux';
import {
    EDITOR_SIDENAV_LOADED,
    EDITOR_SIDENAV_UNLOADED,
    REPORT_DOWNLOADED,
    REPORT_PDF_CREATED,
    REPORT_SUBMITTED,
    REPORT_UPLOADED
} from "../../constants/actionTypes";
import agent from "../../agent";
import Moment from "moment/moment";
import md5 from 'md5';

const mapStateToProps = state => ({
    ...state.editor,
    ...state.editorSideNav
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({type: EDITOR_SIDENAV_LOADED, payload}),
    onUnload: () =>
        dispatch({ type: EDITOR_SIDENAV_UNLOADED }),
    onSubmit: report =>
        dispatch({ type: REPORT_SUBMITTED, payload: report }),
    onCreatePdf: blob =>
        dispatch({type: REPORT_PDF_CREATED, payload: blob}),
    onDownloadReport: report =>
        dispatch({type: REPORT_DOWNLOADED, payload: report}),
    onUploadReport: report =>
        dispatch({type: REPORT_UPLOADED, payload: report})
});

class SideNav extends Component {

    constructor() {
        super();

        this.submitForm = ev => {
            if (this.props.inProgress) return;
            ev.preventDefault();

            const report = {
                type: this.props.type,
                patientId: this.props.patientId,
                therapistId: this.props.therapistId,
                date: this.props.date && Moment(this.props.date).isValid() ? Moment(this.props.date).format('YYYY-MM-DD') : null,
                freeText: this.props.freeText
            };

            const promise = this.hasReport ?
                agent.Report.update(report, this.props.reportId) :
                agent.Report.create(report);
            this.props.onSubmit(promise);
        };

        this.createPdf = (ev) => {
            ev.preventDefault();

            const report = {
                type: this.props.type,
                patient: this.props.patients.find(p => p.id == this.props.patientId),
                therapist: this.props.therapists.find(t => t.id == this.props.therapistId),
                date: this.props.date && Moment(this.props.date).isValid() ? Moment(this.props.date).format('YYYY-MM-DD') : null,
                freeText: this.props.freeText,
                functions: this.props.functions.map(f => {return {...f, code: this.props.codes.find(code => code.id == f.codeId)}}),
                structures: this.props.structures.map(s => {return {...s, code: this.props.codes.find(code => code.id == s.codeId)}}),
                activities: this.props.activities.map(a => {return {...a, code: this.props.codes.find(code => code.id == a.codeId)}}),
                contexts: this.props.contexts.map(c => {return {...c, code: this.props.codes.find(code => code.id == c.codeId)}})
            };

            this.props.onCreatePdf(agent.Report.getPdf(report));
        };

        this.dump = (ev) => {
            ev.preventDefault();

            const report = {
                type: this.props.type,
                patient: this.props.patients.find(p => p.id == this.props.patientId),
                therapist: this.props.therapists.find(t => t.id == this.props.therapistId),
                date: this.props.date && Moment(this.props.date).isValid() ? Moment(this.props.date).format('YYYY-MM-DD') : null,
                freeText: this.props.freeText,
                functions: this.props.functions.map(f => {return {...f, code: this.props.codes.find(code => code.id == f.codeId)}}),
                structures: this.props.structures.map(s => {return {...s, code: this.props.codes.find(code => code.id == s.codeId)}}),
                activities: this.props.activities.map(a => {return {...a, code: this.props.codes.find(code => code.id == a.codeId)}}),
                contexts: this.props.contexts.map(c => {return {...c, code: this.props.codes.find(code => code.id == c.codeId)}})
            };
            report.hash = md5(JSON.stringify(report));

            this.props.onDownloadReport(report);
        };

        this.upload = (ev) => {
            ev.preventDefault();
            const files = ev.target.files;
            for (let i = 0, f; f = files[i]; i++) {

                //Only process json files.
                if (!f.type.match('application/json')) {
                    continue;
                }

                const reader = new FileReader();
                // Closure to capture the file information.
                reader.onload = ((theFile) => {
                    return (e) => {
                        const report = JSON.parse(e.target.result);
                        const hash = report.hash;
                        delete report.hash;
                        if (md5(JSON.stringify(report)) !== hash)
                            alert('Report has been tampered with!');
                        else
                            this.props.onUploadReport(report);
                    };
                })(f);

                // Read in the json file as text.
                reader.readAsText(f, "UTF-8");
            }
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
                this.props.onUnload();
            }
        }
        else if (nextProps.download) { // download pdf
            const report = nextProps.download;
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            const json = JSON.stringify(report),
                blob = new Blob([json], {type: "application/json"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = `${report.patient.surname}_${new Date().getTime()}.json`;
            a.click();

            window.URL.revokeObjectURL(url);
            this.props.onUnload();
        }
    }

    componentWillMount() {
        this.props.onLoad({});
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    get hasReport() {
        return this.props.reportId && this.props.reportId !== '';
    }

    render() {
        return (
            <div className="sidenav">
                <button onClick={this.submitForm.bind(this)} title="Save on Server">
                    <i className="fa fa-floppy-o" aria-hidden="true"/></button>
                <button onClick={this.createPdf.bind(this)} title="Create PDF"><i className="fa fa-file-pdf-o" aria-hidden="true"/></button>
                <button onClick={this.dump.bind(this)} title="Download"><i className="fa fa-download" aria-hidden="true"/></button>
                <label htmlFor="fileInput" title="Upload" className="custom-file-upload"><i className="fa fa-upload" aria-hidden="true"/></label>
                <input type="file" id="fileInput" onChange={this.upload.bind(this)}/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
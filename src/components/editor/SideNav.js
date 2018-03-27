import React, {Component} from 'react';
import './SideNav.css';
import {connect} from 'react-redux';
import {REPORT_SUBMITTED} from "../../constants/actionTypes";
import agent from "../../agent";
import Moment from "moment/moment";

const mapStateToProps = state => ({
    ...state.editor
});

const mapDispatchToProps = dispatch => ({
    onSubmit: report =>
        dispatch({ type: REPORT_SUBMITTED, payload: report }),
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

            // REST Call
            agent.Report.getPdf(report).then(res => {
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
                }
            })
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

            // File Dump
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            const json = JSON.stringify(report),
                blob = new Blob([json], {type: "application/json"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = report.patient.surname + "_" + new Date().getTime() + "_" +  ".json";
            a.click();

            window.URL.revokeObjectURL(url);
        };

        this.upload = (ev) => {
            ev.preventDefault();
            console.log('upload');
        };
    }

    get hasReport() {
        return this.props.reportId && this.props.reportId !== '';
    }

    render() {
        return (
            <div className="sidenav">
                <a href="#" onClick={this.submitForm.bind(this)} title="Save on Server">
                    <i className="fa fa-floppy-o" aria-hidden="true"/></a>
                <a href="#" onClick={this.createPdf.bind(this)} title="Create PDF"><i className="fa fa-file-pdf-o" aria-hidden="true"/></a>
                <a href="#" onClick={this.dump.bind(this)} title="Download"><i className="fa fa-download" aria-hidden="true"/></a>
                <a href="#" onClick={this.upload.bind(this)} className="disabled" title="Upload"><i className="fa fa-upload" aria-hidden="true"/></a>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
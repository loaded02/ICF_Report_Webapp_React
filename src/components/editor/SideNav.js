import React, {Component} from 'react';
import './SideNav.css';
import {connect} from 'react-redux';
import {
    EDITOR_SIDENAV_LOADED,
    EDITOR_SIDENAV_UNLOADED,
    REPORT_SUBMITTED,
    REPORT_UPLOADED
} from "../../constants/actionTypes";
import agent from "../../agent";
import Moment from "moment/moment";
import md5 from 'md5';
import {API_VERSION} from "../../constants/config";
import download from '../../utils/downloadPdf';

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
    onUploadReport: report =>
        dispatch({type: REPORT_UPLOADED, payload: report})
});

class SideNav extends Component {

    submitForm = ev => {
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

    createPdf = (ev) => {
        ev.preventDefault();

        const report = {
            type: this.props.type,
            patient: {
                dob: this.props.patient.dob && Moment(this.props.patient.dob).isValid() ? Moment(this.props.patient.dob).format('YYYY-MM-DD') : null,
                name: this.props.patient.name,
                surname: this.props.patient.surname,
                diagnosis: this.props.patient.diagnosis
            },
            therapist: this.props.therapist,
            date: this.props.date && Moment(this.props.date).isValid() ? Moment(this.props.date).format('YYYY-MM-DD') : null,
            freeText: this.props.freeText,
            functions: this.props.functions.map(f => {return {...f, code: this.props.codes.find(code => code.id === f.codeId)}}),
            structures: this.props.structures.map(s => {return {...s, code: this.props.codes.find(code => code.id === s.codeId)}}),
            activities: this.props.activities.map(a => {return {...a, code: this.props.codes.find(code => code.id === a.codeId)}}),
            contexts: this.props.contexts.map(c => {return {...c, code: this.props.codes.find(code => code.id === c.codeId)}})
        };

        agent.Report.getPdf(report)
            .then((blob) => download(blob));
    };

    dump = (ev) => {
        ev.preventDefault();

        const report = {
            type: this.props.type,
            patient: {
                dob: this.props.patient.dob && Moment(this.props.patient.dob).isValid() ? Moment(this.props.patient.dob).format('YYYY-MM-DD') : null,
                name: this.props.patient.name,
                surname: this.props.patient.surname,
                diagnosis: this.props.patient.diagnosis
            },
            therapist: this.props.therapist,
            date: this.props.date && Moment(this.props.date).isValid() ? Moment(this.props.date).format('YYYY-MM-DD') : null,
            freeText: this.props.freeText,
            functions: this.props.functions.map(f => {return {...f, code: this.props.codes.find(code => code.id === f.codeId)}}),
            structures: this.props.structures.map(s => {return {...s, code: this.props.codes.find(code => code.id === s.codeId)}}),
            activities: this.props.activities.map(a => {return {...a, code: this.props.codes.find(code => code.id === a.codeId)}}),
            contexts: this.props.contexts.map(c => {return {...c, code: this.props.codes.find(code => code.id === c.codeId)}})
        };
        report.hash = md5(JSON.stringify(report));
        report.version = API_VERSION;

        // download as json
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
    };

    upload = (ev) => {
        ev.preventDefault();
        const files = ev.target.files;
        if (files[0]) {
            const f = files[0];
            //Only process json files.
            if (!f.type.match('application/json')) {
                return;
            }

            const reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = ((theFile) => {
                return (e) => {
                    const report = JSON.parse(e.target.result);
                    const hash = report.hash;
                    delete report.hash;
                    const version = report.version;
                    delete report.version;
                    if (md5(JSON.stringify(report)) !== hash)
                        alert('Report has been tampered with!');
                    else if (API_VERSION !== version)
                        alert('Report Format is from another version!');
                    else
                        this.props.onUploadReport(report);
                };
            })(f);

            // Read in the json file as text.
            reader.readAsText(f, "UTF-8");
        }
    };

    componentDidMount() {
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
                <button onClick={this.submitForm.bind(this)} title="Save ICF Core Set on Server">
                    <i className="fa fa-floppy-o" aria-hidden="true"/></button>
                <button onClick={this.createPdf.bind(this)} title="Create PDF"><i className="fa fa-file-pdf-o" aria-hidden="true"/></button>
                <button onClick={this.dump.bind(this)} title="Download Report"><i className="fa fa-download" aria-hidden="true"/></button>
                <label htmlFor="fileInput" title="Upload Report" className="custom-file-upload"><i className="fa fa-upload" aria-hidden="true"/></label>
                <input type="file" id="fileInput" onChange={this.upload.bind(this)}/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
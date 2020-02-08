import React, {Component} from 'react';
import ReportDeleteButton from './ReportDeleteButton';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { connect } from 'react-redux';
import agent from '../../agent';
import { store } from '../../store';
import { push } from 'connected-react-router';
import download from '../../utils/downloadPdf';

const mapStateToProps = state => ({
    ...state.home
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
            agent.Report.getPdfFromDB(reportId)
                .then((blob) => download(blob));
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    openEditor() {
        store.dispatch(push(`/editor/${this.props.report.id}`));
    }

    render() {
        return(
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret color="success">
                    Actions
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={this.openEditor.bind(this)}>
                        Create Report</DropdownItem>
                    <DropdownItem onClick={(ev) => this.downloadPdf(ev, this.props.report.id)}>
                        Create Plain PDF</DropdownItem>
                    <DropdownItem divider />
                    <ReportDeleteButton reportId={this.props.report.id}/>
                </DropdownMenu>
            </ButtonDropdown>
        )
    }
}

export default connect(mapStateToProps, () => ({}))(ReportButtonGroup);
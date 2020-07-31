import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'https://51.136.123.120:443/api/';
//const API_ROOT = 'http://localhost:8080/api/';

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
    if (token) {
        req.set('authorization', `Bearer ${token}`);
    }
};

const requests = {
    del: url =>
        superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
    get: url =>
        superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
    put: (url, body) =>
        superagent.put(`${API_ROOT}${url}`, body).set('Content-Type', 'application/json').use(tokenPlugin).then(responseBody),
    post: (url, body) =>
        superagent.post(`${API_ROOT}${url}`, body).set('Content-Type', 'application/json').use(tokenPlugin).then(responseBody)
};

const Auth = {
    current: () =>
        requests.get('user'),
    login: (email, password) =>
        requests.post('user/login', { user: { email, password } }),
    register: (username, email, password, firstname, lastname) =>
        requests.post('user', { user: { username, email, password, firstname, lastname } }),
    save: user =>
        requests.put('user', { user })
};

const Profile = {
    get: username =>
        requests.get(`profile/${username}`)
};

const Report = {
    all: () =>
        requests.get('report'),
    get: reportId =>
        requests.get(`report/${reportId}`),
    create: report =>
        requests.post('report', {report}),
    update: (report, reportId) =>
        requests.put(`report/${reportId}`, {report}),
    remove: reportId =>
        requests.del(`report/${reportId}`),
    getPdfFromDB: reportId =>
        superagent.get(`${API_ROOT}report/createPdfFromDB/${reportId}`).responseType('arraybuffer').use(tokenPlugin),
    getPdf: report =>
        superagent.post(`${API_ROOT}report/createPdf`, {report}).set('Content-Type', 'application/json').responseType('arraybuffer').use(tokenPlugin)
};

const Function = {
    all: (reportId, kind) =>
        requests.get(`report/${reportId}/function?kind=${encode(kind)}`),
    get: (reportId, functionId) =>
        requests.get(`report/${reportId}/function/${functionId}`),
    create: (reportId, functionParam) =>
        requests.post(`report/${reportId}/function`, {functionParam}),
    update: (reportId, functionParam, functionId) =>
        requests.put(`report/${reportId}/function/${functionId}`, {functionParam}),
    remove: (reportId, functionId) =>
        requests.del(`report/${reportId}/function/${functionId}`)
};

const Patient = {
    all: () =>
        requests.get('patient'),
    get: patientId =>
        requests.get(`patient/${patientId}`),
    create: patient =>
        requests.post('patient', {patient}),
    update: (patient, patientId) =>
        requests.put(`patient/${patientId}`, {patient}),
    remove: patientId =>
        requests.del(`patient/${patientId}`)
};

const Therapist = {
    all: () =>
        requests.get('therapist'),
    get: therapistId =>
        requests.get(`therapist/${therapistId}`),
    create: therapist =>
        requests.post('therapist', {therapist}),
    update: (therapist, therapistId) =>
        requests.put(`therapist/${therapistId}`, {therapist}),
    remove: therapistId =>
        requests.del(`therapist/${therapistId}`)
};

const Code = {
    all: () =>
        requests.get('code'),
    get: codeId =>
        requests.get(`code/${codeId}`),
    create: code =>
        requests.post('code', {code}),
    update: (code, codeId) =>
        requests.put(`code/${codeId}`, {code}),
    remove: codeId =>
        requests.del(`code/${codeId}`)

};

export default {
    Auth,
    Profile,
    Report,
    Function,
    Patient,
    Therapist,
    Code,
    setToken: _token => { token = _token; }
}
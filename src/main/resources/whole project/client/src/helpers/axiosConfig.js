import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
});

instance.interceptors.request.use(function (config) {
    let session = localStorage.getItem('session');

    if (session !== null && session !== 'undefined') {
        session = JSON.parse(session);
        config.headers.Authorization = `Bearer ${session.token}`;
    } else {
        config.headers.Authorization = '';
    }

    return config;
});

export default instance;

import {store} from '../../redux';

const baseURL = 'http://10.0.4.91:8000/api/';
const defaultTimeout = 10000;
const user = store.getState()?.reducer?.user;

export default {baseURL, defaultTimeout, user};

import axios from 'axios';
import Toast from 'react-native-toast-message';
import {Common} from '../../config';
import {store} from '../index';

let state = store.getState()?.reducer;
let user_authentication = state?.user?.user_authentication;

axios.defaults.baseURL = Common.baseURL;
axios.defaults.timeout = Common.defaultTimeout;

function storeUpdate() {
  state = store.getState()?.reducer;
  user_authentication = state?.user?.user_authentication;

  axios.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${user_authentication}`;
}

function dispatch(action) {
  store.dispatch(action);
}

export default async function postApi(
  endpoint,
  params = null,
  successToast = true,
) {
  storeUpdate();
  dispatch({type: 'LOADER_START'});
  try {
    const response = await axios.post(endpoint, params);
    dispatch({type: 'LOADER_STOP'});
    {
      successToast
        ? Toast.show({
            text1: response.data.message,
            type: 'success',
            visibilityTime: 5000,
          })
        : null;
    }
    return response.data;
  } catch (e) {
    dispatch({type: 'LOADER_STOP'});
    if (e.response?.data?.message) {
      Toast.show({
        text1: e.response.data.message,
        textStyle: {textAlign: 'center'},
        type: 'error',
        visibilityTime: 5000,
      });
    } else {
      Toast.show({
        text1: e.message,
        textStyle: {textAlign: 'center'},
        type: 'error',
        visibilityTime: 5000,
      });
    }
    return null;
  }
}

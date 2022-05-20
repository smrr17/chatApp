import NavService from '../../components/NavService';
import Toast from 'react-native-toast-message';
import {store} from '../index';
import postApi from '../RequestTypes/post';
import * as EmailValidator from 'email-validator';
import getApi from '../RequestTypes/get';

var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema.is().min(8).is().max(100);

let state = store.getState()?.reducer;
let user_id = state?.user?._id;
let user_email = state?.user?.user_email;

function storeUpdate() {
  state = store.getState()?.reducer;
  user_id = state?.user?._id;
  user_email = state?.user?.user_email;
}

function dispatch(action) {
  store.dispatch(action);
}

// Common APIs

export async function login(email, password) {
  if (!email && !password)
    return Toast.show({
      text1: 'Please enter all info',
      type: 'error',
      visibilityTime: 3000,
    });
  if (!EmailValidator.validate(email))
    return Toast.show({
      text1: 'Email not valid',
      type: 'error',
      visibilityTime: 3000,
    });
  if (!schema.validate(password))
    return Toast.show({
      text1: 'Password not valid (Use atleast eight character)',
      type: 'error',
      visibilityTime: 3000,
    });

  // const fcmToken = await getDeviceToken();
  const params = {
    user_email: email,
    user_password: password,
    user_device_type: Platform.OS,
    user_device_token: 'fcmToken',
  };

  const data = await postApi('user_login', params, false);

  console.log(data);

  dispatch({type: 'SAVE_USER', payload: data.data});

  if (data?.status == 1) {
    console.log(data.data.user_is_verified);
    if (data?.data?.user_is_verified == 0) {
      Toast.show({
        text1: 'Please verify your email',
        textStyle: {textAlign: 'center'},
        type: 'error',
        visibilityTime: 5000,
      });
      NavService.reset(0, [{name: 'OTP', params: {nextScreen: 'AppStack'}}]);
    } else {
      Toast.show({
        text1: data.message,
        textStyle: {textAlign: 'center'},
        type: 'success',
        visibilityTime: 5000,
      });
      NavService.reset(0, [{name: 'AppStack'}]);
    }
  } else {
    Toast.show({
      text1: data.message,
      textStyle: {textAlign: 'center'},
      type: 'error',
      visibilityTime: 5000,
    });
  }
}

export async function signup(name, email, password, address, dob, gender) {
  if (!email && !password && !name && !address && !dob && !gender)
    return Toast.show({
      text1: 'Please enter all info',
      type: 'error',
      visibilityTime: 3000,
    });
  if (!EmailValidator.validate(email))
    return Toast.show({
      text1: 'Email not valid',
      type: 'error',
      visibilityTime: 3000,
    });
  if (!schema.validate(password))
    return Toast.show({
      text1: 'Password not valid (Use atleast eight character)',
      type: 'error',
      visibilityTime: 3000,
    });

  // const fcmToken = await getDeviceToken();
  const params = {
    user_naem: name,
    user_email: email,
    user_password: password,
    user_address: address,
    user_dob: dob,
    user_gender: gender,
    user_device_type: Platform.OS,
    user_device_token: 'fcmToken',
  };

  const data = await postApi('signup', params, false);

  console.log(data);

  dispatch({type: 'SAVE_USER', payload: data.data});

  if (data?.status == 1) {
    NavService.reset(0, [{name: 'OTP', params: {nextScreen: 'AppStack'}}]);
  } else {
    Toast.show({
      text1: data.message,
      textStyle: {textAlign: 'center'},
      type: 'error',
      visibilityTime: 5000,
    });
  }
}

export async function forget_password(email) {
  if (!email)
    return Toast.show({
      text1: 'Please enter all info',
      type: 'error',
      visibilityTime: 3000,
    });
  if (!EmailValidator.validate(email))
    return Toast.show({
      text1: 'Email not valid',
      type: 'error',
      visibilityTime: 3000,
    });

  const params = {
    user_email: email,
  };

  const data = await postApi('forgot_password', params);

  console.log(data);

  if (data?.status == 1)
    NavService.reset(0, [{name: 'OTP', params: {nextScreen: 'ResetPassword'}}]);
}

export async function verifyCode(code, nextScreen) {
  storeUpdate();

  if (code.length < 6)
    return Toast.show({text1: 'Please enter the code', type: 'error'});

  const params = {
    user_id,
    user_verification_code: code,
  };

  const data = await postApi('user_verification', params);

  console.log(data);

  if (data?.status == 1) {
    if (nextScreen === 'AppStack') {
      dispatch({type: 'SAVE_USER', payload: data.data});
      NavService.reset(0, [{name: 'AppStack'}]);
    } else NavService.reset(0, [{name: nextScreen}]);
  }
}

export async function resendCode() {
  storeUpdate();
  const params = {
    user_id,
  };
  await postApi('re_send_code', params);
}

export async function resetPassword(password, confirmPassword) {
  storeUpdate();

  if (!confirmPassword && !password)
    return Toast.show({
      text1: 'Please enter all info',
      type: 'error',
      visibilityTime: 3000,
    });
  if (!schema.validate(password))
    return Toast.show({
      text1: 'Password not valid (Use atleast eight character)',
      type: 'error',
      visibilityTime: 3000,
    });
  if (password !== confirmPassword)
    return Toast.show({
      text1: 'Passwords does not match',
      type: 'error',
      visibilityTime: 3000,
    });

  const params = {
    user_email,
    new_password: password,
  };

  const data = await postApi('update_password', params);

  console.log(data);

  if (data?.status == 1) {
    NavService.reset(0, [{name: 'AuthStack'}]);
  } else {
    Toast.show({
      text1: data.message,
      type: 'error',
      visibilityTime: 5000,
    });
  }
}

export async function logout() {
  storeUpdate();
  const params = {user_id};
  console.log(params);
  const data = await postApi('logout', params);
  setTimeout(() => {
    NavService.reset(0, [{name: 'AuthStack'}]);
  }, 100);
}

export async function getContent(content_type) {
  const data = await getApi(`content/${content_type}`, false);
  console.log(data);
  if (data.status == 1) {
    return data.data;
  } else return '';
}

// export function updateProfile(
//   user_fname,
//   user_lname,
//   user_dob,
//   user_city,
//   user_state,
//   imageUrl,
//   imageType,
//   userCategory,
//   gender,
//   goto,
// ) {
//   storeUpdate();
//   return async dispatch => {
//     dispatch({type: 'LOADER_START'});
//     try {
//       const params = new FormData();
//       if (imageUrl)
//         params.append('user_image', {
//           uri: imageUrl,
//           name: `Profile${Date.now()}.${imageType.slice(
//             imageType.lastIndexOf('/') + 1,
//           )}`,
//           type: imageType,
//         });

//       params.append('user_id', user_id);
//       params.append('user_fname', user_fname);
//       params.append('user_lname', user_lname);
//       params.append('user_dob', user_dob);
//       params.append('user_city', user_city);
//       params.append('user_state', user_state);
//       params.append('user_gender', gender);

//       const response = await axios.post('complete_profile', params);

//       const categoryParams = {
//         user_id,
//         userCategory,
//       };

//       let data = {};
//       if (response.data?.status == 1) {
//         const finalResponse = await axios.post(
//           'completeProfileCategries',
//           categoryParams,
//         );
//         data = finalResponse.data;
//       }

//       dispatch({type: 'LOADER_STOP'});

//       if (data?.status == 1) {
//         Toast.show({
//           text1: data.message,
//           type: 'success',
//           visibilityTime: 5000,
//         });
//         dispatch({type: 'SAVE_USER', payload: data.data});
//         if (goto === 'Profile') NavService.navigate(goto);
//         else NavService.reset(0, [{name: 'AppStack'}]);
//       } else {
//         Toast.show({
//           text1: data.message,
//           type: 'error',
//           visibilityTime: 5000,
//         });
//       }
//     } catch (e) {
//       dispatch({type: 'LOADER_STOP'});
//       Toast.show({
//         text1: e.response.data.message,
//         type: 'error',
//         visibilityTime: 5000,
//       });
//       // setTimeout(() => {
//       //   dispatch({type: 'LOGOUT'});
//       // }, 1000);
//       // NavService.reset(0, [{name: 'Auth'}]);
//     }
//   };
// }

// export function resendCode() {
//   storeUpdate();
//   return async dispatch => {
//     try {
//       const params = {
//         user_id,
//       };
//       params;
//       const response = await axios.post('re_send_code', params);
//       const data = response.data;
//       if (data?.status == 1) {
//         Toast.show({
//           text1: data.message,
//           type: 'success',
//           visibilityTime: 5000,
//         });
//       } else {
//         Toast.show({
//           text1: data.message,
//           type: 'error',
//           visibilityTime: 5000,
//         });
//       }
//     } catch (e) {
//       Toast.show({
//         text1: e.response.data.message,
//         type: 'error',
//         visibilityTime: 5000,
//       });
//     }
//   };
// }

// export function policies(content_type, setPolicies) {
//   return async dispatch => {
//     dispatch({type: 'LOADER_START'});
//     try {
//       const params = {content_type};
//       const response = await axios.post('content', params);
//       const data = response.data;
//       dispatch({type: 'LOADER_STOP'});
//       if (data?.status == 1) {
//         setPolicies(data.data);
//       } else {
//         Toast.show({
//           text: data.message,
//           textStyle: {textAlign: 'center'},
//           type: 'danger',
//           duration: 5000,
//         });
//       }
//     } catch (e) {
//       dispatch({type: 'LOADER_STOP'});
//       Toast.show({
//         text: e.response.data.message,
//         textStyle: {textAlign: 'center'},
//         type: 'danger',
//         duration: 5000,
//       });
//       return {};
//     }
//   };
// }

//App Dependent APIs

// export function categoryList(saveCategory) {
//   storeUpdate();
//   return async dispatch => {
//     dispatch({type: 'LOADER_START'});
//     try {
//       const params = {user_id, user_authentication};
//       const response = await axios.post('categoryList', params);
//       const data = response.data;
//       dispatch({type: 'LOADER_STOP'});
//       if (data?.status == 1) {
//         saveCategory(data.data);
//       } else {
//         Toast.show({
//           text1: data.message,
//           type: 'error',
//           visibilityTime: 5000,
//         });
//       }
//     } catch (e) {
//       dispatch({type: 'LOADER_STOP'});
//       Toast.show({
//         text1: e.response.data.message,
//         type: 'error',
//         visibilityTime: 5000,
//       });
//     }
//   };
// }

// export function productList(category_id) {
//   storeUpdate();
//   return async dispatch => {
//     dispatch({type: 'LOADER_START'});
//     try {
//       const params = {user_id, category_id};
//       const response = await axios.post('productList', params);
//       const data = response.data;

//       dispatch({type: 'LOADER_STOP'});
//       if (data?.status == 1) {
//         dispatch({type: 'SAVE_PRODUCTS', payload: data.data});
//       } else {
//         Toast.show({
//           text1: data.message,
//           type: 'error',
//           visibilityTime: 5000,
//         });
//       }
//     } catch (e) {
//       dispatch({type: 'LOADER_STOP'});

//       Toast.show({
//         text1: e.response.data.message,
//         type: 'error',
//         visibilityTime: 5000,
//       });
//     }
//   };
// }

// export function couponList(saveCoupon) {
//   storeUpdate();
//   return async dispatch => {
//     // dispatch({type: 'LOADER_START'});
//     try {
//       const params = {user_id};
//       const response = await axios.post('userProductList', params);
//       const data = response.data;

//       // dispatch({type: 'LOADER_STOP'});
//       if (data?.status == 1) {
//         saveCoupon(data.data);
//         // dispatch({type: 'SAVE_CATEGORY', payload: data.data});
//       } else {
//         Toast.show({
//           text1: data.message,
//           type: 'error',
//           visibilityTime: 5000,
//         });
//       }
//     } catch (e) {
//       // dispatch({type: 'LOADER_STOP'});

//       Toast.show({
//         text1: e.response.data.message,
//         type: 'error',
//         visibilityTime: 5000,
//       });
//     }
//   };
// }

// export function productDetails(product_id, saveDetails) {
//   storeUpdate();
//   return async dispatch => {
//     dispatch({type: 'LOADER_START'});
//     try {
//       const params = {user_id, product_id};
//       const response = await axios.post('productDetails', params);
//       const data = response.data;
//       dispatch({type: 'LOADER_STOP'});
//       if (data?.status == 1) {
//         saveDetails(data.data);
//       } else {
//         Toast.show({
//           text1: data.message,
//           type: 'error',
//           visibilityTime: 5000,
//         });
//       }
//     } catch (e) {
//       dispatch({type: 'LOADER_STOP'});

//       Toast.show({
//         text1: e.response.data.message,
//         type: 'error',
//         visibilityTime: 5000,
//       });
//     }
//   };
// }

// export function addUserProduct(product_id) {
//   storeUpdate();
//   return async dispatch => {
//     dispatch({type: 'LOADER_START'});
//     try {
//       const params = {user_id, product_id};
//       const response = await axios.post('addUserProduct', params);
//       const data = response.data;
//       dispatch({type: 'LOADER_STOP'});
//       if (data?.status == 1) {
//         Toast.show({
//           text1: data.message,
//           type: 'success',
//           visibilityTime: 5000,
//         });
//       } else {
//         Toast.show({
//           text1: data.message,
//           type: 'error',
//           visibilityTime: 5000,
//         });
//       }
//     } catch (e) {
//       dispatch({type: 'LOADER_STOP'});
//       Toast.show({
//         text1: e.response.data.message,
//         type: 'error',
//         visibilityTime: 5000,
//       });
//     }
//   };
// }

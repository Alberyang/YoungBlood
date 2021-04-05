import {createActions} from 'redux-actions';
import axios from '../helpers/axiosConfig';
import {push} from 'connected-react-router';

export const {
  fetchUserStarted,
  fetchUserSuccess,
  fetchUserFailure,
  updateUserStarted,
  updateUserSuccess,
  updateUserFailure,
  authUserStarted,
  authUserSuccess,
  authUserFailure,
  deleteUserStarted,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserSuccess,
  forgotPasswordStarted,
  forgotPasswordSuccess,
  forgotPasswordFailure,
} = createActions(
  {
    FETCH_USER_SUCCESS: (data) => ({data}),
    FETCH_USER_FAILURE: (error) => ({error}),
    UPDATE_USER_SUCCESS: (data) => ({data}),
    UPDATE_USER_FAILURE: (error) => ({error}),
    AUTH_USER_SUCCESS: (data) => ({data}),
    AUTH_USER_FAILURE: (error) => ({error}),
    DELETE_USER_FAILURE: (error) => ({error}),
    RESET_PASSWORD_FAILURE: (error) => ({error}),
    FORGOT_PASSWORD_FAILURE: (error) => ({error}),
  },
  'FETCH_USER_STARTED',
  'UPDATE_USER_STARTED',
  'AUTH_USER_STARTED',
  'DELETE_USER_STARTED',
  'DELETE_USER_SUCCESS',
  'SIGN_OUT_USER_SUCCESS',
  'RESET_PASSWORD_STARTED',
  'RESET_PASSWORD_SUCCESS',
  'FORGOT_PASSWORD_STARTED',
  'FORGOT_PASSWORD_SUCCESS'
);

export const fetchUser = (page) => {
  return async (dispatch) => {
    dispatch(fetchUserStarted());

    let session = localStorage.getItem('session');

    if (session !== null && session !== 'undefined') {
      session = JSON.parse(session);
      dispatch(fetchUserSuccess(session));
    } else {
      try {
        const response = await axios.get(`/user`);
        localStorage.setItem('session', JSON.stringify(response.data));
        dispatch(fetchUserSuccess(response.data));
      } catch (error) {
        dispatch(fetchUserFailure('Could not retrieve user.'));
      }
    }
  };
};

export const updateUser = (data) => {
  return async (dispatch) => {
    dispatch(updateUserStarted());

    try {
      const response = await axios.put(`/user`, data);
      localStorage.setItem('session', JSON.stringify(response.data));
      dispatch(updateUserSuccess(response.data));
      dispatch(push('/'));
    } catch (error) {
      dispatch(updateUserFailure('Updating user was unsuccessful.'));
    }
  };
};

export const signUpUser = (data) => {
  return async (dispatch) => {
    dispatch(authUserStarted());

    try {
      const response = await axios.post(`/user`, data);
      localStorage.setItem('session', JSON.stringify(response.data));
      dispatch(authUserSuccess(response.data));
      dispatch(push('/'));
    } catch (error) {
      dispatch(
        authUserFailure('This email already exists or username is invalid.')
      );
    }
  };
};

export const signInUser = (data) => {
  return async (dispatch) => {
    dispatch(authUserStarted());

    try {
      const response = await axios.post(`user/sign-in`, data);
      localStorage.setItem('session', JSON.stringify(response.data));
      dispatch(authUserSuccess(response.data));
      dispatch(push('/'));
    } catch (error) {
      dispatch(
        authUserFailure(
          'Your email or password is incorrect. Please try again.'
        )
      );
    }
  };
};

export const signOutUser = () => {
  return async (dispatch) => {
    localStorage.removeItem('session');

    dispatch(signOutUserSuccess());
    dispatch(push('/'));
  };
};

export const deleteUser = () => {
  return async (dispatch) => {
    dispatch(deleteUserStarted());

    try {
      await axios.delete(`/user`);
      localStorage.removeItem('session');
      dispatch(deleteUserSuccess());
      dispatch(push('/'));
    } catch (error) {
      dispatch(deleteUserFailure('User could not be deleted.'));
    }
  };
};

export const resetPassword = (data, token) => {
  return async (dispatch) => {
    dispatch(authUserStarted());

    try {
      const response = await axios.post(`/user/reset/${token}`, data);
      localStorage.setItem('session', JSON.stringify(response.data));
      console.log(response.data);
      dispatch(authUserSuccess(response.data));
      dispatch(push('/'));
    } catch (error) {
      dispatch(authUserFailure('Could not reset your password.'));
    }
  };
};

export const forgotPassword = (data) => {
  return async (dispatch) => {
    dispatch(forgotPasswordStarted());

    try {
      const response = await axios.post(`/user/recover`, data);
      dispatch(forgotPasswordSuccess(response.data));
    } catch (error) {
      dispatch(
        forgotPasswordFailure('Your email is incorrect. Please try again.')
      );
    }
  };
};

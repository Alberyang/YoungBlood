import {createActions} from 'redux-actions';
import axios from '../helpers/axiosConfig';
import {push} from 'connected-react-router';

export const {
  fetchMomentStarted,
  fetchMomentSuccess,
  fetchMomentFailure,
} = createActions(
  {
    FETCH_MOMENT_SUCCESS: (data) => ({data}),
    FETCH_MOMENT_FAILURE: (error) => ({error}),
  },
  'FETCH_MOMENT_STARTED'
);

export const fetchMoment = () => {
  return async (dispatch) => {
    dispatch(fetchMomentStarted());
    try {
      const response = await axios.get(`/moment`);
      dispatch(fetchMomentSuccess(response.data));
    } catch (error) {
      dispatch(fetchMomentFailure('Could not retrieve moments.'));
    }
  };
};

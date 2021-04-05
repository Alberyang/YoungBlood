import {handleActions} from 'redux-actions';

export default handleActions(
  {
    FETCH_MOMENT_STARTED: (state) => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    FETCH_MOMENT_SUCCESS: (state, action) => ({
      ...state,
      isFetching: false,
      moments: action.payload.data.moments,
      error: null,
    }),
    FETCH_MOMENT_FAILURE: (state, action) => ({
      ...state,
      isFetching: false,
      error: action.payload.error,
    }),
  },
  {
    isFetching: false,
    isUpdating: false,
    moments: [],
    error: null,
  }
);

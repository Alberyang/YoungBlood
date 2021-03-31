import { handleActions } from 'redux-actions';

export default handleActions(
  {
    FETCH_EXPERIENCES_STARTED: (state) => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    FETCH_EXPERIENCES_SUCCESS: (state , action) => ({
      ...state,
      isFetching: false,
      experiences: action.payload.data,
    }),
    FETCH_EXPERIENCES_FAILURE: (state , action) => ({
      ...state,
      isFetching: false,
      error: action.payload.error,
    }),

    POST_EXPERIENCE_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    POST_EXPERIENCE_SUCCESS: (state, action) => ({
      ...state,
      isUpdating: false,
      experiences: [...state.experiences, action.payload.data],
    }),
    POST_EXPERIENCE_FAILURE: (state , action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),

    UPDATE_EXPERIENCE_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    UPDATE_EXPERIENCE_SUCCESS: (state , action) => ({
      ...state,
      isUpdating: false,
      experiences: [...state.experiences, action.payload.data]
    }),
    UPDATE_EXPERIENCE_FAILURE: (state , action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),

    DELETE_EXPERIENCE_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    DELETE_EXPERIENCE_SUCCESS: (state , action) => ({
      ...state,
      isUpdating: false,
      experiences: [...state.experiences, action.payload.data]
    }),
    DELETE_EXPERIENCE_FAILURE: (state , action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),



  },
  {
    isFetching: false,
    isUpdating: false,
    experiences: [],
    experience: {},
    error: null,
  }
);

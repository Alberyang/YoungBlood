import { handleActions } from 'redux-actions';

export default handleActions(
  {
    FETCH_COURSES_STARTED: (state) => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    FETCH_COURSES_SUCCESS: (state , action) => ({
      ...state,
      isFetching: false,
      courses: action.payload.data,
      error: null
    }),
    FETCH_COURSES_FAILURE: (state , action) => ({
      ...state,
      isFetching: false,
      error: action.payload.error,
    }),

    POST_COURSE_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    POST_COURSE_SUCCESS: (state, action) => ({
      ...state,
      isUpdating: false,
      courses: [...state.courses, action.payload.data],
      error: null
    }),
    POST_COURSE_FAILURE: (state , action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),

    UPDATE_COURSE_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    UPDATE_COURSE_SUCCESS: (state , action) => ({
      ...state,
      isUpdating: false,
      courses: [...state.courses, action.payload.data],
      error: null
    }),
    UPDATE_COURSE_FAILURE: (state , action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),

    DELETE_COURSE_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    DELETE_COURSE_SUCCESS: (state , action) => ({
      ...state,
      isUpdating: false,
      courses: [...state.courses, action.payload.data],
      error: null
    }),
    DELETE_COURSE_FAILURE: (state , action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),

  },
  {
    isFetching: false,
    isUpdating: false,
    courses: [],
    course: {},
    error: null,
  }
);

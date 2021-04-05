import { handleActions } from 'redux-actions';

export default handleActions(
  {
    FETCH_PROJECT_LIST_STARTED: (state) => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    FETCH_PROJECT_LIST_SUCCESS: (state , action) => ({
      ...state,
      isFetching: false,
      projects: action.payload.data.projects,
    }),
    FETCH_PROJECT_LIST_FAILURE: (state , action) => ({
      ...state,
      isFetching: false,
      error: action.payload.error,
    }),
    FETCH_PROJECT_LIST_CONDITION_STARTED: (state) => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    FETCH_PROJECT_LIST_CONDITION_SUCCESS: (state , action) => ({
      ...state,
      isFetching: false,
      projects: action.payload.data.result,
    }),
    FETCH_PROJECT_LIST_CONDITION_FAILURE: (state, action) => ({
      ...state,
      isFetching: false,
      error: action.payload.error,
    }),
    CREATE_PROJECT_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    CREATE_PROJECT_SUCCESS: (state, action) => ({
      ...state,
      isUpdating: false,
      projects: [...state.projects, action.payload.data],
    }),
    CREATE_PROJECT_FAILURE: (state , action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),
    FETCH_PROJECT_STARTED: (state) => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    FETCH_PROJECT_SUCCESS: (state , action) => ({
      ...state,
      isFetching: false,
      project: action.payload.data.project,
    }),
    FETCH_PROJECT_FAILURE: (state , action) => ({
      ...state,
      isFetching: false,
      error: action.payload.error,
    }),
    UPDATE_PROJECT_STARTED: (state) => ({
      ...state,
      isUpdatingGen: true,
      error: null,
    }),
    UPDATE_PROJECT_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingGen: false,
      project: action.payload.data.result,
    }),
    UPDATE_PROJECT_FAILURE: (state , action) => ({
      ...state,
      isUpdatingGen: false,
      error: action.payload.error,
    }),
    LIKE_PROJECT_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    LIKE_PROJECT_SUCCESS: (state , action) => ({
      ...state,
      isUpdating: false,
      project: action.payload.data.project,
    }),
    LIKE_PROJECT_FAILURE: (state , action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),
    //MAY BE THERE WILL BE A DISLIKE
    DELETE_PROJECT_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    DELETE_PROJECT_SUCCESS: (state , action) => ({
      ...state,
      isUpdating: false,
      projects: state.projects.filter(proj => proj._id !== action.payload.data),
    }),
    DELETE_PROJECT_FAILURE: (state , action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),
    CREATE_CONTRIBUTOR_STARTED: (state) => ({
      ...state,
      isUpdatingCon: true,
      error: null,
    }),
    CREATE_CONTRIBUTOR_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingCon: false,
      project: action.payload.data,
    }),
    CREATE_CONTRIBUTOR_FAILURE: (state , action) => ({
      ...state,
      isUpdatingCon: false,
      error: action.payload.error,
    }),
    DELETE_CONTRIBUTOR_STARTED: (state) => ({
      ...state,
      isUpdatingCon: true,
      error: null,
    }),
    DELETE_CONTRIBUTOR_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingCon: false,
      project: action.payload.data,
    }),
    DELETE_CONTRIBUTOR_FAILURE: (state , action) => ({
      ...state,
      isUpdatingCon: false,
      error: action.payload.error,
    }),
    CREATE_PROCESS_STARTED: (state) => ({
      ...state,
      isUpdatingProc: true,
      error: null,
    }),
    CREATE_PROCESS_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      project: action.payload.data,
    }),
    CREATE_PROCESS_FAILURE: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      error: action.payload.error,
    }),
    UPDATE_PROCESS_STARTED: (state) => ({
      ...state,
      isUpdatingProc: true,
      error: null,
    }),
    UPDATE_PROCESS_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      project: action.payload.data,
    }),
    UPDATE_PROCESS_FAILURE: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      error: action.payload.error,
    }),
    DELETE_PROCESS_STARTED: (state) => ({
      ...state,
      isUpdatingProc: true,
      error: null,
    }),
    DELETE_PROCESS_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      project: action.payload.data,
    }),
    DELETE_PROCESS_FAILURE: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      error: action.payload.error,
    }),
    CREATE_NODE_STARTED: (state) => ({
      ...state,
      isUpdatingProc: true,
      error: null,
    }),
    CREATE_NODE_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      project: action.payload.data,
    }),
    CREATE_NODE_FAILURE: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      error: action.payload.error,
    }),
    UPDATE_NODE_STARTED: (state) => ({
      ...state,
      isUpdatingProc: true,
      error: null,
    }),
    UPDATE_NODE_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      project: action.payload.data,
    }),
    UPDATE_NODE_FAILURE: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      error: action.payload.error,
    }),
    DELETE_NODE_STARTED: (state) => ({
      ...state,
      isUpdatingProc: true,
      error: null,
    }),
    DELETE_NODE_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      project: action.payload.data,
    }),
    DELETE_NODE_FAILURE: (state , action) => ({
      ...state,
      isUpdatingProc: false,
      error: action.payload.error,
    }),
    FINISH_NODE_STARTED: (state) => ({
      ...state,
      //isUpdating: true,
      error: null,
    }),
    FINISH_NODE_SUCCESS: (state , action) => ({
      ...state,
      //isUpdating: false,
      project: action.payload.data,
    }),
    FINISH_NODE_FAILURE: (state , action) => ({
      ...state,
      //isUpdating: false,
      error: action.payload.error,
    }),
    CREATE_TIMELINE_STARTED: (state) => ({
      ...state,
      isUpdatingTime: true,
      error: null,
    }),
    CREATE_TIMELINE_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingTime: false,
      project: action.payload.data,
    }),
    CREATE_TIMELINE_FAILURE: (state , action) => ({
      ...state,
      isUpdatingTime: false,
      error: action.payload.error,
    }),
    UPDATE_TIMELINE_STARTED: (state) => ({
      ...state,
      isUpdatingTime: true,
      error: null,
    }),
    UPDATE_TIMELINE_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingTime: false,
      project: action.payload.data,
    }),
    UPDATE_TIMELINE_FAILURE: (state , action) => ({
      ...state,
      isUpdatingTime: false,
      error: action.payload.error,
    }),
    DELETE_TIMELINE_STARTED: (state) => ({
      ...state,
      isUpdatingTime: true,
      error: null,
    }),
    DELETE_TIMELINE_SUCCESS: (state , action) => ({
      ...state,
      isUpdatingTime: false,
      project: action.payload.data,
    }),
    DELETE_TIMELINE_FAILURE: (state , action) => ({
      ...state,
      isUpdatingTime: false,
      error: action.payload.error,
    }),
  },
  {
    isFetching: false,
    isUpdating: false,
    isUpdateCon: false,
    isUpdateTime :false,
    isUpdateProc: false,
    isUpdateGen: false,
    projects: [],
    project: {},
    error: null,
  }
);

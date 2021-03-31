import { handleActions } from 'redux-actions';

export default handleActions(
  {
    FETCH_DOCUMENTS_STARTED: (state) => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    FETCH_DOCUMENTS_SUCCESS: (state, action) => ({
      ...state,
      isFetching: false,
      documents: action.payload.data.pdfs,
    }),
    FETCH_DOCUMENTS_FAILURE: (state, action) => ({
      ...state,
      isFetching: false,
      error: action.payload.error,
    }),
    FETCH_DOCUMENT_STARTED: (state) => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    FETCH_DOCUMENT_SUCCESS: (state, action) => ({
      ...state,
      isFetching: false,
      document: action.payload.data.pdfs,
    }),
    FETCH_DOCUMENT_FAILURE: (state, action) => ({
      ...state,
      isFetching: false,
      error: action.payload.error,
    }),
    POST_DOCUMENT_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    POST_DOCUMENT_SUCCESS: (state, action) => ({
      ...state,
      isUpdating: false,
      documents: [...state.documents, action.payload.data],
      document: action.payload.data,
    }),
    POST_DOCUMENT_FAILURE: (state, action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),
    UPDATE_DOCUMENT_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    UPDATE_DOCUMENT_SUCCESS: (state) => ({
      ...state,
      isUpdating: false,
    }),
    UPDATE_DOCUMENT_FAILURE: (state, action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),
    DELETE_DOCUMENT_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    DELETE_DOCUMENT_SUCCESS: (state, action) => ({
      ...state,
      documents: state.documents.filter((item) => item._id !== action.payload.data),
      isUpdating: false,
    }),
    DELETE_DOCUMENT_FAILURE: (state, action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),
  },
  {
    isFetching: false,
    isUpdating: false,
    documents: [],
    document: {},
    error: null,
  }
);

import { handleActions } from 'redux-actions';

export default handleActions(
  {
    FETCH_PHOTOS_STARTED: (state) => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    FETCH_PHOTOS_SUCCESS: (state, action) => ({
      ...state,
      isFetching: false,
      photos: action.payload.data.files,
    }),
    FETCH_PHOTOS_FAILURE: (state, action) => ({
      ...state,
      isFetching: false,
      error: action.payload.error,
    }),
    FETCH_PHOTO_STARTED: (state) => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    FETCH_PHOTO_SUCCESS: (state, action) => ({
      ...state,
      isFetching: false,
      photo: action.payload.data.files,
    }),
    FETCH_PHOTO_FAILURE: (state, action) => ({
      ...state,
      isFetching: false,
      error: action.payload.error,
    }),
    POST_PHOTO_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    POST_PHOTO_SUCCESS: (state, action) => ({
      ...state,
      isUpdating: false,
      photos: [...state.photos, action.payload.data],
      photo: action.payload.data,
    }),
    POST_PHOTO_FAILURE: (state, action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),
    DELETE_PHOTO_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    DELETE_PHOTO_SUCCESS: (state, action) => ({
      ...state,
      photos: state.photos.filter((item) => item._id !== action.payload.data),
      isUpdating: false,
    }),
    DELETE_PHOTO_FAILURE: (state, action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),
    FETCH_AVATAR_STARTED: (state) => ({
      ...state,
      isFetching: true,
      error: null,
    }),
    FETCH_AVATAR_SUCCESS: (state, action) => ({
      ...state,
      isFetching: false,
      avatar: action.payload.data.files,
    }),
    FETCH_AVATAR_FAILURE: (state, action) => ({
      ...state,
      isFetching: false,
      error: action.payload.error,
    }),
    POST_AVATAR_STARTED: (state) => ({
      ...state,
      isUpdating: true,
      error: null,
    }),
    POST_AVATAR_SUCCESS: (state, action) => ({
      ...state,
      isUpdating: false,
      avatar: [action.payload.data],
    }),
    POST_AVATAR_FAILURE: (state, action) => ({
      ...state,
      isUpdating: false,
      error: action.payload.error,
    }),
  },
  {
    isFetching: false,
    isUpdating: false,
    photos: [],
    photo: {},
    avatar: [],
    error: null,
  }
);

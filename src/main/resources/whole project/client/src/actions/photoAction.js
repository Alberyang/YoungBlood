import {createActions} from 'redux-actions';
import axios from '../helpers/axiosConfig';
import {push} from 'connected-react-router';

export const {
  fetchPhotosStarted,
  fetchPhotosSuccess,
  fetchPhotosFailure,
  fetchPhotoStarted,
  fetchPhotoSuccess,
  fetchPhotoFailure,
  postPhotoStarted,
  postPhotoSuccess,
  postPhotoFailure,
  deletePhotoStarted,
  deletePhotoSuccess,
  deletePhotoFailure,
  updatePhotoFailure,
  fetchAvatarStarted,
  fetchAvatarSuccess,
  fetchAvatarFailure,
  postAvatarStarted,
  postAvatarSuccess,
  postAvatarFailure,
} = createActions(
  {
    FETCH_PHOTOS_SUCCESS: (data) => ({data}),
    FETCH_PHOTOS_FAILURE: (error) => ({error}),
    FETCH_PHOTO_SUCCESS: (data) => ({data}),
    FETCH_PHOTO_FAILURE: (error) => ({error}),
    POST_PHOTO_SUCCESS: (data) => ({data}),
    POST_PHOTO_FAILURE: (error) => ({error}),
    DELETE_PHOTO_SUCCESS: (data) => ({data}),
    DELETE_PHOTO_FAILURE: (error) => ({error}),
    FETCH_AVATAR_SUCCESS: (data) => ({data}),
    FETCH_AVATAR_FAILURE: (error) => ({error}),
    POST_AVATAR_SUCCESS: (data) => ({data}),
    POST_AVATAR_FAILURE: (error) => ({error}),
  },
  'FETCH_PHOTOS_STARTED',
  'FETCH_PHOTO_STARTED',
  'POST_PHOTO_STARTED',
  'DELETE_PHOTO_STARTED',
  'FETCH_AVATAR_STARTED',
  'POST_AVATAR_STARTED',
);

export const fetchPhotos = (page) => {
  return async (dispatch) => {
    dispatch(fetchPhotosStarted());

    try {
      const response = await axios.get(`/image?page=${page}`);
      dispatch(fetchPhotosSuccess(response.data));
    } catch (error) {
      dispatch(fetchPhotosFailure('Could not retrieve photos.'));
    }
  };
};

export const fetchPhoto = (filename) => {
  return async (dispatch) => {
    dispatch(fetchPhotoStarted());

    try {
      const response = await axios.get(`/image/${filename}`);
      dispatch(fetchPhotoSuccess(response.data));
    } catch (error) {
      dispatch(fetchPhotoFailure('Could not retrieve photo.'));
    }
  };
};

export const deletePhoto = (id) => {
  return async (dispatch) => {
    dispatch(deletePhotoStarted());

    try {
      await axios.delete(`/image/${id}`);
      dispatch(deletePhotoSuccess(id));
      dispatch(push('/image'));
    } catch (error) {
      dispatch(deletePhotoFailure('Could not delete photo.'));
    }
  };
};

export const postPhoto = (url, data) => {
  return async (dispatch) => {
    dispatch(postPhotoStarted());

    try {
      const response = await axios.post(url, data);
      dispatch(postPhotoSuccess(response.data));
      dispatch(push('/image'));
    } catch (error) {
      dispatch(postPhotoFailure('Could not add photo.'));
    }
  };
};

export const fetchAvatar = (page) => {
  return async (dispatch) => {
    dispatch(fetchAvatarStarted());

    try {
      const response = await axios.get(`/avatar?page=${page}`);
      dispatch(fetchAvatarSuccess(response.data));
    } catch (error) {
      dispatch(fetchAvatarFailure('Could not retrieve avatar.'));
    }
  };
};

export const postAvatar = (data,config) => {
  return async (dispatch) => {
    dispatch(postPhotoStarted());

    try {
      const response = await axios.post( '/avatar/upload', data, config)
      dispatch(postAvatarSuccess(response.data));
      dispatch(push('/'));
    } catch (error) {
      dispatch(postAvatarFailure('Could not add avatar.'));
    }
  };
};
